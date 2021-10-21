import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import axios from 'axios'

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { User } from '../../entities/user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginGithubService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtHandlerService: JwtHandlerService,
        private configService: ConfigService
    ) { }

    async login(code) {
        try {

            const accessTokenUri = this.configService.get<string>('github.accessTokenUri');
            const userUri = this.configService.get<string>('github.userUri');
            const userEmailUri = this.configService.get<string>('github.userEmailUri');
            const clientId = this.configService.get<string>('github.clientId');
            const secretId = this.configService.get<string>('github.secretId');
            // const redirectUri = this.configService.get<string>('github.redirectUri');
            // const scope = this.configService.get<string>('github.scope');

            const getAccessTokenApiCall = await axios.post(`${accessTokenUri}?client_id=${clientId}&client_secret=${secretId}&code=${code}`,
                {},
                {
                    headers: {
                        "content-type": "application/json",
                        "Accept": "application/json"
                    }
                })

            const gitHubaccessToken = getAccessTokenApiCall?.data?.access_token
            console.log(gitHubaccessToken)

            const getUserInfo = await axios.get(`${userUri}`, {
                headers: {
                    Authorization: `Bearer ${gitHubaccessToken}`
                }
            })

            console.log(getUserInfo.data)
        }
        catch (err) {
            console.log(err.request);
            console.log('api call github err :', err.message);
        }
    }

    // async login(email: string, password: string) {

    //     const user:any = await this.getUserByEmailService.find(email, false, true);
    //     const passwordsMatch = await bcrypt.compare(password, user.password);

    //     if (!user && !passwordsMatch) {
    //         throw new BadRequestException("Email and/or password missmatch");
    //     }

    //     const xsrfToken = crypto.randomBytes(64).toString('hex');

    //     const accessPayload = {
    //         username: user.username,
    //         email: user.email,
    //         userId: user.id.toString(),
    //         xsrfToken,
    //         confirmed: user.confirmed,
    //         role: user.role?.name
    //     };

    //     const accessSecret = process.env.JWT_SECRET
    //     const expiresIn = process.env.JWT_EXPIRE_IN

    //     const accessToken = await this.jwtHandlerService.createJWT(
    //         accessPayload,
    //         accessSecret,
    //         expiresIn
    //     )

    //     const refreshPayload = { username: user.username, email: user.email };
    //     const refreshSecret = process.env.JWT_REFRESH_SECRET
    //     const refreshIn = process.env.JWT_REFRESH_IN

    //     const refreshToken = await this.jwtHandlerService.createJWT(
    //         refreshPayload,
    //         refreshSecret,
    //         refreshIn
    //     )

    //     //TODO generate redis function in authRedisService
    //     const userProperties = new Map<string, string>([
    //         ["role", JSON.stringify(user.role?.name)],
    //         ["confirmed", JSON.stringify(user.confirmed)],
    //         ["refresh_token", JSON.stringify(refreshToken)],
    //         ["access_token", JSON.stringify(accessToken)],
    //     ]);

    //     this.redisHandlerService.setUser(user.id, userProperties)

    //     return {
    //         accessToken,
    //         expiresIn,
    //         refreshToken,
    //         refreshIn,
    //         xsrfToken
    //     };
    // }
}