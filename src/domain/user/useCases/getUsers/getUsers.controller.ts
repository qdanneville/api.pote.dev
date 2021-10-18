import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Roles } from '../../services/auth/decorators/roles.decorator';
import { Role } from '../../services/auth/enums/role.enum';
import { ConfirmedGuard } from '../../services/auth/guards/confirmed.guard';
import { RolesGuard } from '../../services/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard';
import { GetUsers } from './getUsers.service';

@Controller('users')
export class GetUsersController {
    constructor(private readonly getUsers: GetUsers) { }

    @Get('/')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard, ConfirmedGuard)
    async GetAllUsers(@Request() req) {
        return this.getUsers.find()
    }

    @Get('/public')
    async GetAllUsersPrivate() {
        return this.getUsers.find()
    }
}