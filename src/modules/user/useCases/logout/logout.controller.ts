import {
    Controller, Post, UseGuards, Request, Response, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard';
import { LogoutService } from './logout.service';

@Controller('auth/logout')
export class LogoutController {
    constructor(private readonly logoutService: LogoutService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async function(@Request() req, @Response() res) {

        await this.logoutService.logout(req.user)

        res.cookie('access_token', '', { expires: new Date() })
        res.cookie('refresh_token', '', { expires: new Date() })

        return
    }
}