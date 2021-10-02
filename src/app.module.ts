import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './database/prisma/prisma.module';
import { UsersModule } from './modules/user/user.module'

//Auth module
import { AuthModule } from './services/auth/auth.module'

//Mail
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import config from './configs/config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule,
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_USERNAME}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}`,
      defaults: {
        from: '"ton@pote.dev" <ton@pote.dev>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule { }
