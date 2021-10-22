import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import axios from 'axios'

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { User } from '../../entities/user';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../repos/user.repository';

@Injectable()
export class CheckGithubUserService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtHandlerService: JwtHandlerService,
        private userRepository: UserRepository,
        private configService: ConfigService
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
            const confirmed = emailObject[0]?.verified

            const user = {
                username,
                email: emailObject[0].email as string,
                confirmed
            }

            console.log(user);

            const userExists = await this.userRepository.userExists(user.email)

            if (userExists) {
                console.log('create access & refresh redis logic')
            } else {
                console.log('register user', user)
                return user
            }
        }
        catch (err) {
            console.log(err);
            console.log('api call github err :', err.message);
            return new BadRequestException(err.message)
        }
    }
}