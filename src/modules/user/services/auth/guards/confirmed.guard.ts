import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RedisHandlerService } from '../redis/redis-handler.service';

@Injectable()
export class ConfirmedGuard implements CanActivate {
    constructor(
        private redisHandlerService: RedisHandlerService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const { user } = context.switchToHttp().getRequest();

        let isVerified;

        try {
            isVerified = await this.redisHandlerService.getValue(
                user.userId,
                'isEmailVerified',
            );
        }
        catch (err) {
            isVerified = false;
        }

        if (isVerified === 'false') {
            return false
        }

        return isVerified
    }
}