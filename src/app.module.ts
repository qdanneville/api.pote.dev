import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './database/prisma/prisma.module';
import { UsersModule } from './modules/user/user.module'

//Auth module
import { AuthModule } from './services/auth/auth.module'

import config from './configs/config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule { }
