import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Roles } from 'src/services/auth/decorators/roles.decorator';
import { Role } from 'src/services/auth/enums/role.enum';
import { RolesGuard } from 'src/services/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../../services/auth/guards/jwt-auth.guard';
import { GetUsers } from './getUsers.service';

@Controller('users')
export class GetUsersController {
    constructor(private readonly getUsers: GetUsers) { }

    @Get('/')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async GetAllUsers(@Request() req) {
        return this.getUsers.find()
    }

    @Get('/public')
    async GetAllUsersPrivate() {
        return this.getUsers.find()
    }
}