import {
    Controller,
    HttpCode,
    HttpStatus,
    Query,
    Post,
    Request,
    Response,
} from '@nestjs/common';
import { CheckGithubUserService } from './checkGithubUser.service';

import { CheckGithubUserDto } from '../../dtos/checkGithubUser.dto';

@Controller('oauth/check/github')
export class CheckGithubUserController {
    constructor(private readonly checkGithubUserService: CheckGithubUserService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Query() query: CheckGithubUserDto, @Request() req, @Response() res) {
        const { code } = query;
        const result: any = await this.checkGithubUserService.check(code)

        if (result.status === "login" && result.data) {
            res.cookie('access_token', result.data.accessToken, {
                httpOnly: true,
                // secure: true,
            });

            res.cookie('refresh_token', result.data.refreshToken, {
                httpOnly: true,
                // secure: true,
            });

            res.json({
                accessTokenExpiresIn: result.data.expiresIn,
                refreshTokenExpiresIn: result.data.refreshIn,
                xsrfToken: result.data.xsrfToken
            });
        } else if (result.status === "register") {
            res.json(result.data)
        }
    }
}