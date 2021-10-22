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

    async login(body) {
        try {
            console.log('ready to login github user', body)
        }
        catch (err) {

        }
    }
}