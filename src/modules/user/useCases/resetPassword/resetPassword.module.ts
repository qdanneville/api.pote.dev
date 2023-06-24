import { Module } from '@nestjs/common';
import { ResetPasswordService } from './resetPassword.service';
import { ResetPasswordController } from './resetPassword.controller';
import { UserRepository } from '../../repos/user.repository';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [ResetPasswordService, RedisAuthService, UserRepository, ],
    controllers: [ResetPasswordController],
    exports: [ResetPasswordService],
})
export class ResetPasswordModule { }