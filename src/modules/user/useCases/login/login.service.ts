import { Injectable, BadRequestException, ConsoleLogger } from '@nestjs/common';
import { GetUserByEmailService } from '../../useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';

import * as bcrypt from 'bcrypt';

import { UserEmail } from '../../domain/userEmail';
import { UserPassword } from '../../domain/userPassword';
import { LoginDTO } from './login.dto';
import { User } from '../../domain/user';
import { UserRepository } from '../../repos/user.repository';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Injectable()
export class LoginService {
    constructor(
        private readonly redisAuthService: RedisAuthService,
        private readonly userRepository: UserRepository,
    ) { }

    async login(req: LoginDTO) {

        let user: User

        try {
            const emailDomain = UserEmail.create(req.email)
            const passwordDomain = UserPassword.create({ value: req.password });

            const password = passwordDomain.value

            try {
                user = await this.userRepository.getUserByEmail(emailDomain)
            }
            catch (err) {
                throw new BadRequestException("Email and/or password missmatch");
            }

            const passwordsMatch = await user.password.comparePassword(password);

            if (!passwordsMatch) {
                throw new BadRequestException("Email and/or password missmatch");
            }

            const xsrfToken = this.redisAuthService.createXsrfToken()

            console.log('user :', user);
            console.log('user role :', user.role);
            console.log('user role id :', user.role.roleId);

            //CARE
            //We might want the role name here
            //TO CHECK
            const accessPayload = {
                username: user.username.value,
                email: user.email.value,
                userId: user.id.toString(),
                xsrfToken,
                isEmailVerified: user.isEmailVerified,
                isAdmin: user.isAdmin,
                roleName: user.role.name,
            };

            console.log('access payload', accessPayload);
            const accessToken = await this.redisAuthService.createAccessToken(accessPayload)

            console.log('access token', accessToken);

            const refreshPayload = { username: user.username.value, email: user.email.value };
            const refreshToken = await this.redisAuthService.createRefreshToken(refreshPayload)

            user.setAccessToken(accessToken, refreshToken)

            await this.redisAuthService.addRedisUser(user)

            return {
                accessToken,
                refreshToken,
                xsrfToken
            };
        }
        catch (err) {
            console.log('err')
            throw new BadRequestException(err.toString())
        }
    }
}