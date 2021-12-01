import { Module } from '@nestjs/common';
import { CheckGithubUserService } from './checkGithubUser.service';
import { CheckGithubUserController } from './checkGithubUser.controller';
import { UserRepository } from '../../repos/user.repository';
import { githubProviderService } from '../../services/authProviders/githubProvider.service';
import { LoginGithubService } from '../loginGithub/loginGithub.service';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [CheckGithubUserService, githubProviderService, RedisAuthService, UserRepository, LoginGithubService],
    controllers: [CheckGithubUserController],
    exports: [CheckGithubUserService]
})
export class CheckGithubUserModule { }