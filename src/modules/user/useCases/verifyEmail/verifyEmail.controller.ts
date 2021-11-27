import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';


import { VerifyEmailService } from './verifyEmail.service';
import { VerifyEmailDto } from './verifyEmail.dto';

@Controller('/auth/Verify_email')
export class VerifyEmailController {
    constructor(private readonly verifyEmailService: VerifyEmailService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async function(@Body() body: VerifyEmailDto) {
        return this.verifyEmailService.verifyEmail(body)
    }
}