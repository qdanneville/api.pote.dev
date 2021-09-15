import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUser } from './createUser';
import { CreateUserDto } from '../../dto/createUser.dto';

@Controller('users')
export class CreateUserController {
    constructor(private readonly createUser: CreateUser) { }

    @Post()
    async createPost(@Body() user: CreateUserDto) {
        return this.createUser.create(user);
    }
}