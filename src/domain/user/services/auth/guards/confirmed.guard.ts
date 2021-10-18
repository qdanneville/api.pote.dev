import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisHandlerService } from '../redis/redis-handler.service';

@Injectable()
export class ConfirmedGuard implements CanActivate {
    constructor(
        private redisHandlerService: RedisHandlerService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const { user } = context.switchToHttp().getRequest();

        //TODO get confirmed with redis
        // const isConfirmed = await this.redisHandlerService.getValue(
        //     user.userId,
        //     'confirmed',
        // );

        // if (isConfirmed === 'false') {
        //     return false
        // }

        return user.confirmed
    }
}