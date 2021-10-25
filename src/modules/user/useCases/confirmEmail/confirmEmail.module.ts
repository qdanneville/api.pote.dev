import { Module } from '@nestjs/common';
import { ConfirmEmailService } from './confirmEmail.service';
import { UserRepository } from '../../repos/user.repository';
import { ConfirmEmailController } from './confirmEmail.controller';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';

@Module({
    providers: [ConfirmEmailService, UserRepository, RedisHandlerService],
    controllers: [ConfirmEmailController],
})
export class ConfirmEmailModule { }