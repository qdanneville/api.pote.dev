import { Module } from '@nestjs/common';
import { LoginGithubService } from './loginGithub.service';
import { UserRepository } from '../../repos/user.repository';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [LoginGithubService, UserRepository, RedisHandlerService, ConfigService],
    exports: [LoginGithubService]
})
export class LoginGithubModule { }