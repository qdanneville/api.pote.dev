import { Module } from '@nestjs/common';
import { LoginGithubService } from './loginGithub.service';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [LoginGithubService, RedisAuthService],
    exports: [LoginGithubService]
})
export class LoginGithubModule { }