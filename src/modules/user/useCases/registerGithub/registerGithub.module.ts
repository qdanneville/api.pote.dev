import { Module } from '@nestjs/common';
import { RegisterGithubService } from './registerGithub.service';
import { RegisterGithubController } from './registerGithub.controller';
import { UserRepository } from '../../repos/user.repository';
import { LoginGithubService } from '../loginGithub/loginGithub.service';
import { RoleRepository } from '../../repos/role.repository';
import { githubProviderService } from '../../services/authProviders/githubProvider.service';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [RegisterGithubService, LoginGithubService, githubProviderService, RoleRepository, UserRepository, RoleRepository, RedisAuthService],
    controllers: [RegisterGithubController],
    exports: [RegisterGithubService]
})
export class RegisterGithubModule { }