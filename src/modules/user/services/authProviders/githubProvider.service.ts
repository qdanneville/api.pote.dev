import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios'
import { AuthProviderProfileInfo, AuthProviderProfileEmail } from './models/authProviderInfo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class githubProviderService {
    constructor(
        private configService: ConfigService,
    ) { }

    public async getAccessToken(code): Promise<string> {
        const accessTokenUri = this.configService.get<string>('github.accessTokenUri');
        const clientId = this.configService.get<string>('github.clientId');
        const secretId = this.configService.get<string>('github.secretId');

        const getAccessTokenApiCall = await axios.post(`${accessTokenUri}?client_id=${clientId}&client_secret=${secretId}&code=${code}`,
            {},
            {
                headers: {
                    "content-type": "application/json",
                    "Accept": "application/json"
                }
            })

        return getAccessTokenApiCall?.data?.access_token
    }

    public async getProfileInfo(token): Promise<AuthProviderProfileInfo> {
        const userUri = this.configService.get<string>('github.userUri');

        const profileResponse = await axios.get(`${userUri}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })


        const { email, verified } = await this.getUserMail(token)
        const username: string = profileResponse?.data?.login;

        return {
            username,
            email,
            verified
        }
    }

    private async getUserMail(token): Promise<AuthProviderProfileEmail> {
        const userEmailUri = this.configService.get<string>('github.userEmailUri');

        const response = await axios.get(`${userEmailUri}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const primaryEmail: AuthProviderProfileEmail = response.data?.filter(email => email.primary)

        return primaryEmail
    }
}