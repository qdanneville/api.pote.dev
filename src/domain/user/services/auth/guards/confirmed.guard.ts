import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RedisHandlerService } from '../redis/redis-handler.service';

@Injectable()
export class ConfirmedGuard implements CanActivate {
    constructor(
        private redisHandlerService: RedisHandlerService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const { user } = context.switchToHttp().getRequest();

        let isConfirmed;

        try {
            isConfirmed = await this.redisHandlerService.getValue(
                user.userId,
                'confirmed',
            );
        }
        catch (err) {
            isConfirmed = false;
        }

        if (isConfirmed === 'false') {
            return false
        }

        return user.confirmed
    }
}