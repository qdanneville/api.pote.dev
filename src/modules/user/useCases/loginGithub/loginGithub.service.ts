import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import axios from 'axios'

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginGithubService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtHandlerService: JwtHandlerService,
        private configService: ConfigService
    ) { }

    async login(user) {
        try {
            const xsrfToken = crypto.randomBytes(64).toString('hex');

            const accessPayload = {
                username: user.username,
                email: user.email,
                userId: user.id.toString(),
                xsrfToken,
                confirmed: user.confirmed,
                role: user.role?.name
            };

            const accessSecret = process.env.JWT_SECRET
            const expiresIn = process.env.JWT_EXPIRE_IN

            const accessToken = await this.jwtHandlerService.createJWT(
                accessPayload,
                accessSecret,
                expiresIn
            )

            const refreshPayload = { username: user.username, email: user.email };
            const refreshSecret = process.env.JWT_REFRESH_SECRET
            const refreshIn = process.env.JWT_REFRESH_IN

            const refreshToken = await this.jwtHandlerService.createJWT(
                refreshPayload,
                refreshSecret,
                refreshIn
            )

            //TODO generate redis function in authRedisService
            const userProperties = new Map<string, string>([
                ["role", JSON.stringify(user.role?.name)],
                ["confirmed", JSON.stringify(user.confirmed)],
                ["refresh_token", JSON.stringify(refreshToken)],
                ["access_token", JSON.stringify(accessToken)],
            ]);

            this.redisHandlerService.setUser(user.id, userProperties)

            return {
                accessToken,
                expiresIn,
                refreshToken,
                refreshIn,
                xsrfToken
            };

        }
        catch (err) {

        }
    }
}