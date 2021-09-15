import { Injectable } from '@nestjs/common';
import { GetUserByEmail } from '../../modules/user/useCases/getUserByEmail/getUserByEmail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private getUserByEmail: GetUserByEmail,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {

        const user = await this.getUserByEmail.find(email);
        const passwordsMatch = await bcrypt.compare(pass, user.password);

        if (user && passwordsMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}