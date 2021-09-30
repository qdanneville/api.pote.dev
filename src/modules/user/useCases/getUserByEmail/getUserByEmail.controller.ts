import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetUserByEmail } from './getUserByEmail.service';
import { GetUserByEmailDto } from '../../dto/getUserByEmail.dto'

@Controller('users')
export class GetUserByEmailController {
    constructor(private readonly getUserByEmailService: GetUserByEmail) { }

    @Get('email/:email')
    async getUserByEmail(@Param() params: GetUserByEmailDto) {
        return this.getUserByEmailService.find(params.email)
    }
}