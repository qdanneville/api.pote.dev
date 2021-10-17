import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUserByEmailModule } from '../../modules/user/useCases/getUserByEmail/getUserByEmail.module'
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisHandlerModule } from './redis/redis-handler.module'
import { JwtHandlerModule } from './jwt/jwt-handler.module'
import { UserRepository } from '../../modules/user/user.repository';
import { AuthController } from './auth.controller'
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        GetUserByEmailModule,
        PassportModule,
        RedisHandlerModule,
        JwtHandlerModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RolesGuard, UserRepository],
    exports: [AuthService]
})
export class AuthModule { }
