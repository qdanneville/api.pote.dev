import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RedisHandlerService } from '../redis/redis-handler.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private redisHandlerService: RedisHandlerService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        let userRole;

        try {
            userRole = await this.redisHandlerService.getValue(
                user.userId,
                'role',
            );
        }
        catch (err) {
            return false
        }

        return requiredRoles.some((role) => userRole?.includes(role));
    }
}