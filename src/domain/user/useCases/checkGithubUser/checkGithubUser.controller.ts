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
import { CheckGithubUserService } from './checkGithubUser.service';

import { CheckGithubUserDto } from '../../dtos/checkGithubUser.dto';

@Controller('oauth/check/github')
export class CheckGithubUserController {
    constructor(private readonly CheckGithubUserService: CheckGithubUserService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Query() query: CheckGithubUserDto, @Request() req) {
        try {
            console.log('query', query)

            const { code } = query;

            return this.CheckGithubUserService.check(code)
        }
        catch (err) {
            throw new UnauthorizedException(err);
        }
    }
}