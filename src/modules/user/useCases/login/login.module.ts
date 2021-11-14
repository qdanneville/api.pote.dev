import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserRepository } from '../../repos/user.repository';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [LoginService, RedisAuthService, UserRepository],
    controllers: [LoginController],
    exports: [LoginService]
})
export class LoginModule { }