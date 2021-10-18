import { Injectable, BadGatewayException } from '@nestjs/common';
import { GetUserByEmailService } from '../../useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto'

@Injectable()
export class ForgotPasswordService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private getUserByEmail: GetUserByEmailService,
        private readonly mailerService: MailerService
    ) { }

    async forgotPassword(email) {

        try {
            const user = await this.getUserByEmail.find(email, true)

            if (!user) {
                return
            }

            const forgotPasswordToken = crypto.randomBytes(64).toString('hex');

            await this.redisHandlerService.client.set(
                process.env.FORGET_PASSWORD_PREFIX + forgotPasswordToken,
                user.id,
                'ex',
                process.env.FORGET_PASSWORD_TOKEN_EXPIRES_IN
            )

            await this.mailerService
                .sendMail({
                    to: user.email,
                    from: 'ton@pote.dev', // sender address
                    subject: 'Demande de mot de passe oublié sur pote.dev ✔', // Subject line
                    text: `Hey ${user.firstname}, /n <a href="${process.env.APP_BASE_URL}/change-password/${forgotPasswordToken}">reset password</a>`, // plaintext body
                    html: `<b>Hey ${user.firstname}, /n </b></br><a href="${process.env.APP_BASE_URL}/change-password/${forgotPasswordToken}">reset password</a>`, // HTML body content
                })
        }
        catch (err) {
            return new BadGatewayException('Something went wrong')
        }

        return
    }
}