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

import { CheckGithubUserDTO } from './checkGithubUser.dto';

@Controller('oauth/check/github')
export class CheckGithubUserController {
    constructor(private readonly checkGithubUserService: CheckGithubUserService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Query() query: CheckGithubUserDTO, @Request() req, @Response() res) {
        const result: any = await this.checkGithubUserService.check(query)

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
                xsrfToken: result.data.xsrfToken
            });
        } else if (result.status === "register") {
            res.json(result.data)
        }
    }
}