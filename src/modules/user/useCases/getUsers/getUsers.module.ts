import { Module } from '@nestjs/common';
import { GetUsers } from './getUsers.service';
import { UserRepository } from '../../user.repository';
import { GetUsersController } from './getUsers.controller';
import { RolesGuard } from 'src/services/auth/guards/roles.guard';
import { ConfirmedGuard } from 'src/services/auth/guards/confirmed.guard';

@Module({
    providers: [GetUsers, UserRepository, RolesGuard, ConfirmedGuard],
    controllers: [GetUsersController],
    exports: [GetUsers],
})
export class GetUsersModule { }