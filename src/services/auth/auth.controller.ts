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
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(@Request() req, @Response() res) {
        try {
            const result = await this.authService.login(req.user);

            console.log('service auth result : ', result)

            /* On créer le cookie contenant le JWT */
            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                // secure: true,
            });

            /* On créer le cookie contenant le refresh token */
            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                // secure: true,
                // path: '/token'
            });

            /* On envoie une reponse JSON contenant les durées de vie des tokens et le token CSRF */
            res.json({
                accessTokenExpiresIn: result.expiresIn,
                refreshTokenExpiresIn: result.refreshIn,
                xsrfToken: result.xsrfToken
            });
        }
        catch (err) {
            throw new UnauthorizedException(
                `Something went wrong ${err}`,
            );
        }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Request() req) {
        return req.user;
    }
}