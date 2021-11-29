import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisAuthService } from '../../services/auth/redisAuth.service';
import { UserRepository } from '../../repos/user.repository';
import { MailerService } from '@nestjs-modules/mailer';

import { UserEmail } from '../../domain/userEmail';
import { ForgotPasswordToken } from '../../domain/forgotPasswordToken';

import * as crypto from 'crypto'
import { forgotPasswordResponse } from './forgotPassword.dto';

@Injectable()
export class ForgotPasswordService {
    constructor(
        private redisAuthService: RedisAuthService,
        private userRepository: UserRepository,
        // private readonly mailerService: MailerService
    ) { }

    async forgotPassword(email) {
        let user;

        try {
            const emailDomain = UserEmail.create(email)

            try {
                user = await this.userRepository.getUserByEmail(emailDomain)
            } catch (err) {
                console.log('err', err)
                const response: forgotPasswordResponse = {
                    token: ""
                }
                return response
            }

            const token = crypto.randomBytes(64).toString('hex');
            const date = new Date();

            const forgotPasswordTokenPayload = {
                value: token,
                date
            }

            const forgotPasswordToken = ForgotPasswordToken.create(forgotPasswordTokenPayload)
            this.redisAuthService.addForgotPasswordToken({ token: forgotPasswordToken.value, userId: user.id })

            // await this.redisHandlerService.client.set(
            //     process.env.FORGET_PASSWORD_PREFIX + forgotPasswordToken,
            //     user.id,
            //     'ex',
            //     process.env.FORGET_PASSWORD_TOKEN_EXPIRES_IN
            // )

            // await this.mailerService
            //     .sendMail({
            //         to: user.email,
            //         from: 'ton@pote.dev', // sender address
            //         subject: 'Demande de mot de passe oublié sur pote.dev ✔', // Subject line
            //         text: `Hey ${user.firstname}, /n <a href="${process.env.APP_BASE_URL}/change-password/${forgotPasswordToken}">reset password</a>`, // plaintext body
            //         html: `<b>Hey ${user.firstname}, /n </b></br><a href="${process.env.APP_BASE_URL}/change-password/${forgotPasswordToken}">reset password</a>`, // HTML body content
            //     })

            const response: forgotPasswordResponse = {
                token: forgotPasswordToken.value
            }

            return response
        }
        catch (err) {
            throw new BadRequestException(err.message);
        }

        return
    }
}