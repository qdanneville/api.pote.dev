import { Module } from '@nestjs/common';
import { RegisterGithubService } from './registerGithub.service';
import { RegisterGithubController } from './registerGithub.controller';
import { CreateUserService } from '../createUser/createUser.service';
import { UserRepository } from '../../repos/user.repository';
import { ConfigService } from '@nestjs/config';
import { LoginGithubService } from '../loginGithub/loginGithub.service';
import { RoleRepository } from '../../repos/role.repository';

@Module({
    providers: [RegisterGithubService, CreateUserService, LoginGithubService, RoleRepository, UserRepository, ConfigService],
    controllers: [RegisterGithubController],
    exports: [RegisterGithubService]
})
export class RegisterGithubModule { }