import { Module } from '@nestjs/common';
import { GetUsers } from './getUsers.service';
import { UserRepository } from '../../user.repository';
import { GetUsersController } from './getUsers.controller';

@Module({
    providers: [GetUsers, UserRepository],
    controllers: [GetUsersController],
    exports: [GetUsers],
})
export class GetUsersModule { }