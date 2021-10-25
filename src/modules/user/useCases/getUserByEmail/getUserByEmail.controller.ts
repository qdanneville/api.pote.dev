import { Controller, Get, Param } from '@nestjs/common';
import { GetUserByEmailService } from './getUserByEmail.service';
import { GetUserByEmailDto } from '../../dtos/getUserByEmail.dto'

import {
    ApiOperation,
    ApiTags,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class GetUserByEmailController {
    constructor(private readonly getUserByEmailService: GetUserByEmailService) { }

    @ApiOperation({ summary: 'Get user with an email' })
    @ApiParam({ name: 'email'})
    @Get('email/:email')
    async getUserByEmail(@Param() params: GetUserByEmailDto) {
        return this.getUserByEmailService.find(params.email)
    }
}