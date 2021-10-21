import {
    Controller,
    HttpCode,
    HttpStatus,
    Query,
    Post,
    Request,
    Response,
    UnauthorizedException
} from '@nestjs/common';
import { LoginGithubService } from './loginGithub.service';

import { LoginGithubDto } from '../../dtos/loginGithub.dto';


@Controller('oauth/github')
export class LoginGithubController {
    constructor(private readonly loginGithubService: LoginGithubService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Query() query: LoginGithubDto, @Request() req, @Response() res) {
        try {
            console.log('query', query)

            const { code } = query;

            return await this.loginGithubService.login(code)
        }
        catch (err) {
            throw new UnauthorizedException(err);
        }
    }
}