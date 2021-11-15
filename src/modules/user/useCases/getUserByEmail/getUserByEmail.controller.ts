import { Controller, Get, Param } from '@nestjs/common';
import { GetUserByEmailService } from './getUserByEmail.service';
import { GetUserByEmailDTO } from './getUserByEmail.dto'
import { UserMap } from '../../mappers/userMap';

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
    @ApiParam({ name: 'email' })
    @Get('email/:email')
    async getUserByEmail(@Param() params: GetUserByEmailDTO) {
        return UserMap.toResponse(await this.getUserByEmailService.find(params))
    }
}