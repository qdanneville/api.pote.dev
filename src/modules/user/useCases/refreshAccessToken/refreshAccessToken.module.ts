import { Module } from '@nestjs/common';
import { RefreshAccessTokenService } from './refreshAccessToken.service';
import { RefreshAccessTokenController } from './refreshAccessToken.controller'

import { UserRepository } from '../../repos/user.repository';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Module({
    providers: [RefreshAccessTokenService, RedisAuthService, UserRepository],
    controllers: [RefreshAccessTokenController],
    exports: [RefreshAccessTokenService],
})
export class RefreshAccessTokenModule { }