import { Module } from '@nestjs/common';
import { GetUsers } from './getUsers.service';
import { UserRepository } from '../../repos/user.repository';
import { GetUsersController } from './getUsers.controller';
import { RolesGuard } from '../../services/auth/guards/roles.guard';
import { ConfirmedGuard } from '../../services/auth/guards/confirmed.guard';

@Module({
    providers: [GetUsers, UserRepository, RolesGuard, ConfirmedGuard],
    controllers: [GetUsersController],
    exports: [GetUsers],
})
export class GetUsersModule { }