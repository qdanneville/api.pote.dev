import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateUser } from './createUser.service';
import { CreateUserDto } from '../../dto/createUser.dto';

@Controller('users')
export class CreateUserController {
    constructor(private readonly createUser: CreateUser) { }

    @Post()
    @HttpCode(201)
    async createPost(@Body() user: CreateUserDto) {
        return this.createUser.create(user);
    }
}