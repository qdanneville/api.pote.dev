import { Module } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { LogoutController } from './logout.controller';
import { UserRepository } from '../../repos/user.repository';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';

@Module({
    providers: [LogoutService, UserRepository, RedisHandlerService],
    controllers: [LogoutController],
    exports: [LogoutService]
})
export class LogoutModule { }