import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { UserRepository } from 'src/modules/user/repos/user.repository';
import { RedisAuthService } from '../../services/auth/redisAuth.service';
import { UserPassword } from '../../domain/userPassword';

@Injectable()
export class ResetPasswordService {
    constructor(
        private redisAuthService: RedisAuthService,
        private userRepo: UserRepository,
    ) { }

    async resetPassword(body) {
        if (body.password !== body.password_copy) {
            throw new BadRequestException("Passwords don't match");
        }

        const { token } = body

        const userId = await this.redisAuthService.getUserIdFromForgotPasswordToken(token);

        const user = await this.userRepo.getUserById(userId)

        if (!user) {
            throw new BadRequestException("User no longer exists");
        }

        const passwordDomain = UserPassword.create({ value: body.password })
        const hashedPassword = await passwordDomain.getHashedValue();

        const updatedUser = await this.userRepo.changePassword(user.id.toString(), hashedPassword)

        await this.redisAuthService.delForgotPasswordTokenKey(token)

        updatedUser.resetPassword()

        return
    }
}