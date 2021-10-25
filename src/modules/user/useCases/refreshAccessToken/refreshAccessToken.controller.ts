import {
    Controller,
    Post,
    Request,
    Response,
    UnauthorizedException
} from '@nestjs/common';

import { RefreshAccessTokenService } from './refreshAccessToken.service';

@Controller('auth/token/refresh')
export class RefreshAccessTokenController {
    constructor(private readonly refreshAccessTokenService: RefreshAccessTokenService) { }

    @Post()
    async token(@Request() req, @Response() res) {
        const refreshToken = req?.cookies?.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException(
                `Can't refresh token`,
            );
        }

        try {
            const result = await this.refreshAccessTokenService.refreshToken(refreshToken);

            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                // secure: true,
            });

            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                // secure: true,
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
}