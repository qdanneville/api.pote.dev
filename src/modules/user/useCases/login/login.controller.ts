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
import { LoginDTO } from './login.dto';
import { LoginService } from './login.service';


@Controller('auth/login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDTO, @Request() req, @Response() res) {
        const result = await this.loginService.login(body);

        if (result.accessToken && result.refreshToken) {
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
}