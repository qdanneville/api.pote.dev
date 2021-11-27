import { Module } from '@nestjs/common';
import { VerifyEmailService } from './verifyEmail.service';
import { UserRepository } from '../../repos/user.repository';
import { VerifyEmailController } from './verifyEmail.controller';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [VerifyEmailService, UserRepository, RedisAuthService],
    controllers: [VerifyEmailController],
})
export class VerifyEmailModule { }