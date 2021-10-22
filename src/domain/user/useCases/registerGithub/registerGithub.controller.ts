import {
    Controller,
    HttpCode,
    HttpStatus,
    Body,
    Post,
    Request,
    Response,
    UnauthorizedException
} from '@nestjs/common';
import { RegisterGithubService } from './registerGithub.service';
import { RegisterGithubDto } from '../../dtos/RegisterGithub.dto';

@Controller('oauth/register/github')
export class RegisterGithubController {
    constructor(private readonly registerGithubService: RegisterGithubService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: RegisterGithubDto, @Request() req, @Response() res) {
        const result = await this.registerGithubService.register(body)

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
}