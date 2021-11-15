import { Module } from '@nestjs/common';
import { GetCurrentUserController } from './getCurrentUser.controller';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';
import { UserRepository } from '../../repos/user.repository';

@Module({
    providers: [GetUserByEmailService, UserRepository],
    controllers: [GetCurrentUserController],
})
export class GetCurrentUserModule { }