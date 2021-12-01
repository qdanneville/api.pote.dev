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

        let response

        try {
            response = await axios.post(`${accessTokenUri}?client_id=${clientId}&client_secret=${secretId}&code=${code}`,
                {},
                {
                    headers: {
                        "content-type": "application/json",
                        "Accept": "application/json"
                    }
                })
        } catch (err) {
            console.log('err:', err);
            throw new BadRequestException('Github code invalid or expired')
        }

        return response?.data?.access_token
    }

    public async getProfileInfo(token): Promise<AuthProviderProfileInfo> {
        const userUri = this.configService.get<string>('github.userUri');
        let infoResponse;
        let emailResponse;

        try {
            infoResponse = await axios.get(`${userUri}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            emailResponse = await this.getUserMail(token)
        }
        catch (err) {
            console.log('err:', err);
            throw new BadRequestException('Github access token invalid or expired')
        }

        const { email, verified } = emailResponse
        const username: string = infoResponse?.data?.login;

        return {
            username,
            email,
            verified
        }
    }

    private async getUserMail(token: string): Promise<AuthProviderProfileEmail> {
        const userEmailUri = this.configService.get<string>('github.userEmailUri');

        const response = await axios.get(`${userEmailUri}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const primaryEmail: AuthProviderProfileEmail = response.data?.filter(email => email.primary)

        return primaryEmail[0]
    }
}