import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../repos/user.repository';
import { RedisAuthService } from '../../services/auth/redisAuth.service';

@Injectable()
export class VerifyEmailService {
    constructor(
        private redisAuthService: RedisAuthService,
        private userRepo: UserRepository,
    ) { }

    async verifyEmail(body) {
        const { token } = body
        const userId = await this.redisAuthService.getUserIdFromEmailVerificationToken(token);

        const user = await this.userRepo.getUserById(userId)

        if (!user) {
            throw new BadRequestException("User no longer exists");
        }

        const updatedUser = await this.userRepo.confirmUser(userId)
        await this.redisAuthService.delVerifyEmailTokenKey(token)

        updatedUser.verifyEmail()

        return
    }
}