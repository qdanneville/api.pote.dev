import { Module } from '@nestjs/common';
import { CheckGithubUserService } from './checkGithubUser.service';
import { CheckGithubUserController } from './checkGithubUser.controller';
import { UserRepository } from '../../repos/user.repository';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { LoginGithubService } from '../loginGithub/loginGithub.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [CheckGithubUserService, LoginGithubService, UserRepository, RedisHandlerService, ConfigService],
    controllers: [CheckGithubUserController],
    exports: [CheckGithubUserService]
})
export class CheckGithubUserModule { }