import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import { ResetPasswordService } from './resetPassword.service';
import { ResetPasswordDto } from '../../dtos/resetPassword.dto'

@Controller('auth/reset_password')
export class ResetPasswordController {
    constructor(private readonly resetPasswordService: ResetPasswordService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.resetPasswordService.resetPassword(body)
    }
}