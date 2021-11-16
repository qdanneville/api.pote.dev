import { Module } from '@nestjs/common';
import { ConfirmEmailService } from './confirmEmail.service';
import { UserRepository } from '../../repos/user.repository';
import { ConfirmEmailController } from './confirmEmail.controller';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [ConfirmEmailService, UserRepository, RedisAuthService],
    controllers: [ConfirmEmailController],
})
export class ConfirmEmailModule { }