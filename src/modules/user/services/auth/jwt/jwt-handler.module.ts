import { Global, Module } from '@nestjs/common';
import { JwtHandlerService } from './jwt-handler.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
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
    providers: [JwtHandlerService],
    exports: [JwtHandlerService],
})
export class JwtHandlerModule { }