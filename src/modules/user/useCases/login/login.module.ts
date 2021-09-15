import { Module } from '@nestjs/common';
import { UserRepository } from '../../user.repository';
import { LoginController } from './login.controller';

@Module({
      providers: [UserRepository],
      controllers: [LoginController],
})
export class LoginModule { }