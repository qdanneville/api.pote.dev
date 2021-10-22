import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import axios from 'axios'

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { User } from '../../entities/user';
import { ConfigService } from '@nestjs/config';
import { CreateUserService } from '../createUser/createUser.service';
import { LoginGithubService } from '../loginGithub/loginGithub.service';

@Injectable()
export class RegisterGithubService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private createUserService: CreateUserService,
        private loginGithubService: LoginGithubService,
        private jwtHandlerService: JwtHandlerService
    ) { }

    async register(body) {
        try {
            const decodedToken = await this.jwtHandlerService.verifyToken(body.formToken, process.env.JWT_OAUTH_SECRET)

            const key = process.env.JWT_OAUTH_TOKEN_PREFIX + body.formToken;
            const userEmail = await this.redisHandlerService.client.get(key);

            if (!userEmail) {
                throw new BadRequestException("Token expired");
            }

            if (userEmail !== decodedToken.email) {
                throw new BadRequestException("Wrong token or already used");
            }

            const userprops = {
                username: body.username,
                email: decodedToken.email,
                confirmed: decodedToken.confirmed
            }
            const user = await this.createUserService.create(userprops, true);
            
            await this.redisHandlerService.client.del(key)

            return this.loginGithubService.login(user)
        }
        catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}