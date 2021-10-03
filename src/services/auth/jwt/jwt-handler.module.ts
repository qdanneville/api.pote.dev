import { Global, Module } from '@nestjs/common';
import { JwtHandlerService } from './jwt-handler.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRE_IN, },
        }),
    ],
    providers: [JwtHandlerService],
    exports: [JwtHandlerService],
})
export class JwtHandlerModule { }