import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
    Request,
    Response,
    UnauthorizedException
} from '@nestjs/common';


import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { ForgotPasswordDto } from '../../dtos/forgotPassword.dto'
import { ResetPasswordDto } from '../../dtos/resetPassword.dto'
import { ConfirmEmailDto } from '../../dtos/confirmEmail.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(@Request() req, @Response() res) {
        try {
            const result = await this.authService.login(req.user);

            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                // secure: true,
            });

            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                // secure: true,
                // path: '/token'
            });

            res.json({
                accessTokenExpiresIn: result.expiresIn,
                refreshTokenExpiresIn: result.refreshIn,
                xsrfToken: result.xsrfToken
            });
        }
        catch (err) {
            throw new UnauthorizedException(err);
        }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Request() req) {
        return req.user;
    }

    @Post('/token')
    async token(@Request() req, @Response() res) {
        const refreshToken = req?.cookies?.refresh_token;
        const email = req.body.email

        if (!refreshToken || !email) {
            throw new UnauthorizedException(
                `Can't refresh token`,
            );
        }

        try {
            const result = await this.authService.refreshToken({ email, refreshToken });

            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                // secure: true,
            });

            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                // secure: true,
                // path: '/token'
            });

            res.json({
                accessTokenExpiresIn: result.expiresIn,
                refreshTokenExpiresIn: result.refreshIn,
                xsrfToken: result.xsrfToken
            });
        }
        catch (err) {
            throw new UnauthorizedException(err);
        }
    }

    @Post('forgot_password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() user: ForgotPasswordDto) {
        return this.authService.forgotPassword(user.email)
    }

    @Post('reset_password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body)
    }
}