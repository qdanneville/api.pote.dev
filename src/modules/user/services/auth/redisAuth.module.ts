import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from './jwt/jwt-handler.service';
import { RedisAuthService } from './redisAuth.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('security.jwtSecret'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [JwtHandlerService, RedisHandlerService, ConfigService, RedisAuthService],
    exports: [RedisAuthService]
})
export class RedisAuthModule { }