import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SendVerifyEmailService } from './sendVerifyEmail.service';
import { SendVerifyEmailDTO } from './sendVerifyEmail.dto';


@Controller('auth/verify-email/')
export class SendVerifyEmailController {
    constructor(private readonly SendVerifyEmailService: SendVerifyEmailService) { }
    @HttpCode(201)
    @Post()
    async function(@Body() body: SendVerifyEmailDTO) {
        return this.SendVerifyEmailService.send(body);
    }
}