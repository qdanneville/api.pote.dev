import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateUserService } from './createUser.service';
import { CreateUserDto } from '../../dtos/createUser.dto';

import {
    ApiBody,
} from '@nestjs/swagger';

@Controller('users')
export class CreateUserController {
    constructor(private readonly createUserService: CreateUserService) { }

    @ApiBody({
        description: 'Create a new user | Password -> MinLength : 6 / MaxLength : 15',
        schema: {
            type: 'object',
            properties: {
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                password: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
            },
        },
    })
    @Post()
    @HttpCode(201)
    async function(@Body() user: CreateUserDto) {
        return this.createUserService.create(user);
    }
}