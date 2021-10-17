import { Module } from '@nestjs/common';
import { GetUsers } from './getUsers.service';
import { UserRepository } from '../../user.repository';
import { GetUsersController } from './getUsers.controller';
import { RolesGuard } from 'src/services/auth/guards/roles.guard';

@Module({
    providers: [GetUsers, UserRepository, RolesGuard],
    controllers: [GetUsersController],
    exports: [GetUsers],
})
export class GetUsersModule { }