import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import axios from 'axios'

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { User } from '../../entities/user';
import { ConfigService } from '@nestjs/config';
import { CreateUserService } from '../createUser/createUser.service';

@Injectable()
export class RegisterGithubService {
    constructor(
        private createUserService: CreateUserService
    ) { }

    async register(user) {
        try {
            const userInDb = this.createUserService.create(user, true);

            console.log('user id db ?', userInDb);
        }
        catch (err) {

        }
    }
}