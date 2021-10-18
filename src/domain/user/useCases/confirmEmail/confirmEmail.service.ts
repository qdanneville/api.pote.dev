import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { UserRepository } from '../../repos/user.repository';

@Injectable()
export class ConfirmEmailService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private userRepo: UserRepository,
    ) { }

    async confirmEmail(body) {
        const key = process.env.CONFIRM_EMAIL_PREFIX + body.token;
        const userId = await this.redisHandlerService.client.get(key);

        if (!userId) {
            throw new BadRequestException("Token expired");
        }

        const user = await this.userRepo.getUserById(userId)

        if (!user) {
            throw new BadRequestException("User no longer exists");
        }

        await this.userRepo.confirmUser(userId)

        await this.redisHandlerService.client.del(key)

        return
    }
}