import { Module } from '@nestjs/common';
import { RefreshAccessTokenService } from './refreshAccessToken.service';
import { RefreshAccessTokenController } from './refreshAccessToken.controller'

import { UserRepository } from '../../repos/user.repository';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';

@Module({
    providers: [RefreshAccessTokenService, UserRepository, GetUserByEmailService],
    controllers: [RefreshAccessTokenController],
    exports: [RefreshAccessTokenService],
})
export class RefreshAccessTokenModule { }