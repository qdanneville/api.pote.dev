import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgotPassword.service';
import { ForgotPasswordController } from './forgotPassword.controller';
import { UserRepository } from '../../repos/user.repository';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [RedisAuthService, ForgotPasswordService, UserRepository],
    controllers: [ForgotPasswordController],
    exports: [ForgotPasswordService],
})
export class ForgotPasswordModule { }