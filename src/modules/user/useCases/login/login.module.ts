import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserRepository } from '../../repos/user.repository';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';

@Module({
    providers: [LoginService, UserRepository, GetUserByEmailService, RedisHandlerService],
    controllers: [LoginController],
    exports: [LoginService]
})
export class LoginModule { }