import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';


import { ConfirmEmailService } from './confirmEmail.service';
import { ConfirmEmailDto } from '../../dtos/confirmEmail.dto';

@Controller('/auth/confirm_email')
export class ConfirmEmailController {
    constructor(private readonly confirmEmailService: ConfirmEmailService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async function(@Body() body: ConfirmEmailDto) {
        return this.confirmEmailService.confirmEmail(body)
    }
}