import { Module } from '@nestjs/common';
import { RegisterGithubService } from './registerGithub.service';
import { RegisterGithubController } from './registerGithub.controller';
import { CreateUserService } from '../createUser/createUser.service';
import { UserRepository } from '../../repos/user.repository';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [RegisterGithubService, CreateUserService, UserRepository, ConfigService],
    controllers: [RegisterGithubController],
    exports: [RegisterGithubService]
})
export class RegisterGithubModule { }