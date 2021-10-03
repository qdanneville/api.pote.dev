import { Controller, Get, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../services/auth/guards/jwt-auth.guard';
import { GetUsers } from './getUsers.service';

@Controller('users')
export class GetUsersController {
    constructor(private readonly getUsers: GetUsers) { }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async GetAllUsers() {
        return this.getUsers.find()
    }

    @Get('/public')
    async GetAllUsersPrivate() {
        return this.getUsers.find()
    }
}