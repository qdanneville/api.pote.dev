import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../../../../services/auth/local-auth.guard'
// import { Login } from './login.service'

@Controller('')
export class LoginController {
    // constructor(private readonly login: Login) { }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async do(@Request() req) {
        // return this.login.log(req.user);
    }
}