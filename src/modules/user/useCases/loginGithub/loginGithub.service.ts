import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import axios from 'axios'

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { ConfigService } from '@nestjs/config';
import { RedisAuthService } from '../../services/auth/redisAuth.service';
import { User } from '../../domain/user';

@Injectable()
export class LoginGithubService {
    constructor(
        private redisAuthService: RedisAuthService,
    ) { }

    async login(user: User) {
        const xsrfToken = this.redisAuthService.createXsrfToken()

        //CARE
        //We might want the role name here
        //TO CHECK
        const accessPayload = {
            username: user.username.value,
            email: user.email.value,
            userId: user.id.toString(),
            xsrfToken,
            isEmailVerified: user.isEmailVerified,
            isAdmin: user.isAdmin,
            roleName: user.role.name,
        };

        const accessToken = await this.redisAuthService.createAccessToken(accessPayload)

        const refreshPayload = { username: user.username.value, email: user.email.value };
        const refreshToken = await this.redisAuthService.createRefreshToken(refreshPayload)

        user.setAccessToken(accessToken, refreshToken)

        await this.redisAuthService.addRedisUser(user)

        return {
            accessToken,
            refreshToken,
            xsrfToken
        };
    }
}