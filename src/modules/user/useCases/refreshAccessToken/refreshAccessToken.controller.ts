import {
    Controller,
    Post,
    Request,
    Response,
    UnauthorizedException
} from '@nestjs/common';
import { RefreshAccessTokenService } from './refreshAccessToken.service';

import { RefreshToken } from '../../domain/refreshToken';

@Controller('auth/token/refresh')
export class RefreshAccessTokenController {
    constructor(private readonly refreshAccessTokenService: RefreshAccessTokenService) { }

    @Post()
    async token(@Request() req, @Response() res) {
        const refreshToken: RefreshToken = req?.cookies?.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException(
                `Can't refresh token`,
            );
        }

        const result = await this.refreshAccessTokenService.refreshToken({ refreshToken });

        res.cookie('access_token', result.accessToken, {
            httpOnly: true,
            // secure: true,
        });

        res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            // secure: true,
        });

        res.json({
            xsrfToken: result.xsrfToken
        });
    }
}