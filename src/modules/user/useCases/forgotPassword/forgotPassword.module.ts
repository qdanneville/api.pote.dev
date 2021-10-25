import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgotPassword.service';
import { ForgotPasswordController } from './forgotPassword.controller';
import { UserRepository } from '../../repos/user.repository';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';

@Module({
    providers: [ForgotPasswordService, UserRepository, GetUserByEmailService],
    controllers: [ForgotPasswordController],
    exports: [ForgotPasswordService],
})
export class ForgotPasswordModule { }