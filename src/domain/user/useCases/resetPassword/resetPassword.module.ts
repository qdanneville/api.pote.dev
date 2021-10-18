import { Module } from '@nestjs/common';
import { ResetPasswordService } from './resetPassword.service';
import { ResetPasswordController } from './resetPassword.controller';
import { UserRepository } from '../../repos/user.repository';

@Module({
    providers: [ResetPasswordService, UserRepository],
    controllers: [ResetPasswordController],
    exports: [ResetPasswordService],
})
export class ResetPasswordModule { }