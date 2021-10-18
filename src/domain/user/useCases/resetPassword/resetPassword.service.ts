import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/domain/user/repos/user.repository';

@Injectable()
export class ResetPasswordService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private userRepo: UserRepository,
    ) { }

    async resetPassword(body) {
        if (body.password !== body.password_copy) {
            throw new BadRequestException("Passwords don't match");
        }

        const key = process.env.FORGET_PASSWORD_PREFIX + body.token;
        const userId = await this.redisHandlerService.client.get(key);

        if (!userId) {
            throw new BadRequestException("Token expired");
        }

        const user = await this.userRepo.getUserById(userId)

        if (!user) {
            throw new BadRequestException("User no longer exists");
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        await this.userRepo.changePassword(userId, hashedPassword)

        await this.redisHandlerService.client.del(key)

        return { user }
    }
}