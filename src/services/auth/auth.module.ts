import { Module } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { AuthService } from './auth.service';
import { GetUserByEmailModule } from '../../modules/user/useCases/getUserByEmail/getUserByEmail.module'
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { RedisModule } from "nestjs-redis";
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RedisHandlerModule } from './redis/redis-handler.module'
import { RedisHandlerService } from './redis/redis-handler.service'
import { AuthController } from './auth.controller'

//TODO config JWT
@Module({
    imports: [
        GetUserByEmailModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRE_IN, },
        }),
        RedisModule.forRootAsync({
            imports: [ConfigService],
            useFactory: (config: ConfigService) => config.get("redis"),
            inject: [ConfigService],
        }),
        RedisHandlerModule
    ],
    controllers: [AuthController],
    providers: [RedisHandlerService, AuthService, LocalStrategy, JwtStrategy],
    exports: [RedisHandlerService, AuthService]
})
export class AuthModule { }
