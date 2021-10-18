import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import { ForgotPasswordService } from './forgotPassword.service';
import { ForgotPasswordDto } from '../../dtos/forgotPassword.dto'

@Controller('auth/forgot_password')
export class ForgotPasswordController {
    constructor(private readonly ForgotPasswordService: ForgotPasswordService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() user: ForgotPasswordDto) {
        return this.ForgotPasswordService.forgotPassword(user.email)
    }
}