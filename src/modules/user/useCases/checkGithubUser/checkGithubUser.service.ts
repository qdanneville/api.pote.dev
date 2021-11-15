import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import axios from 'axios'

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'

import { UserEmail } from '../../domain/userEmail';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../repos/user.repository';
import { LoginGithubService } from '../loginGithub/loginGithub.service';

@Injectable()
export class CheckGithubUserService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtHandlerService: JwtHandlerService,
        private userRepository: UserRepository,
        private configService: ConfigService,
        private loginGithubService: LoginGithubService
    ) { }

    async check(code) {
        try {
            const accessTokenUri = this.configService.get<string>('github.accessTokenUri');
            const userUri = this.configService.get<string>('github.userUri');
            const userEmailUri = this.configService.get<string>('github.userEmailUri');
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

            const gitHubaccessToken = getAccessTokenApiCall?.data?.access_token

            const getUserInfo = await axios.get(`${userUri}`, {
                headers: {
                    Authorization: `Bearer ${gitHubaccessToken}`
                }
            })

            const getUserEmailInfo = await axios.get(`${userEmailUri}`, {
                headers: {
                    Authorization: `Bearer ${gitHubaccessToken}`
                }
            })

            const username: string = getUserInfo?.data?.login;
            const emailObject = getUserEmailInfo?.data?.filter(email => {
                return email.primary
            })

            const userEmail = emailObject[0].email as string
            const confirmed = emailObject[0]?.verified

            // const userExists = await this.userRepository.exists(userEmail)
            //TODO refacto this
            const userExists = false

            if (userExists) {
                const emailDomain = UserEmail.create(userEmail)
                const user = await this.userRepository.getUserByEmail(emailDomain);

                return { data: await this.loginGithubService.login(user), status: 'login' };
            } else {
                const user = {
                    username,
                    email: userEmail,
                    confirmed,
                    formToken: null
                }

                const tokenPayload = { email: user.email, confirmed: user.confirmed };
                const tokenSecret = process.env.JWT_OAUTH_SECRET

                const oauthToken = await this.jwtHandlerService.createJWT(
                    tokenPayload,
                    tokenSecret
                )

                const key = process.env.JWT_OAUTH_TOKEN_PREFIX + oauthToken

                await this.redisHandlerService.client.set(
                    key,
                    user.email,
                )

                user.formToken = oauthToken

                return { data: user, status: 'register' }
            }
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }
}