import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Response,
    UnauthorizedException
} from '@nestjs/common';
import { LoginDto } from '../../dtos/login.dto';
import { LoginService } from './login.service';


@Controller('auth/login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDto, @Request() req, @Response() res) {
        try {
            const { email, password } = body

            const result = await this.loginService.login(email, password);

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