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
        try {
            return this.registerGithubService.register(body)
        }
        catch (err) {
            throw new UnauthorizedException(err);
        }
    }
}