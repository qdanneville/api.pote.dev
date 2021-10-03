import { Controller, Get, Param } from '@nestjs/common';
import { GetUserByEmail } from './getUserByEmail.service';
import { GetUserByEmailDto } from '../../dto/getUserByEmail.dto'

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class GetUserByEmailController {
    constructor(private readonly getUserByEmailService: GetUserByEmail) { }

    @ApiOperation({ summary: 'Get user with an email' })
    @ApiParam({ name: 'email'})
    @Get('email/:email')
    async getUserByEmail(@Param() params: GetUserByEmailDto) {
        return this.getUserByEmailService.find(params.email)
    }
}