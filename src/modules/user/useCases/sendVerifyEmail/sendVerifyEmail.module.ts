import { Module } from '@nestjs/common';
import { SendVerifyEmailService } from './sendVerifyEmail.service';
import { SendVerifyEmailController } from './sendVerifyEmail.controller';
import { UserRepository } from '../../repos/user.repository';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [SendVerifyEmailService, RedisAuthService, UserRepository],
    controllers: [SendVerifyEmailController],
    exports: [SendVerifyEmailService]
})

export class SendVerifyEmailModule { }