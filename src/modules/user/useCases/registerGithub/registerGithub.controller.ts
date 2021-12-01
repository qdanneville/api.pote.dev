import {
    Controller,
    HttpCode,
    HttpStatus,
    Body,
    Post,
    Response,
} from '@nestjs/common';
import { RegisterGithubService } from './registerGithub.service';
import { RegisterGithubDTO } from './RegisterGithub.dto';

@Controller('oauth/register/github')
export class RegisterGithubController {
    constructor(private readonly registerGithubService: RegisterGithubService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() req: RegisterGithubDTO, @Response() res) {
        const result = await this.registerGithubService.register(req)

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