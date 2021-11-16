import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { UserRepository } from '../../repos/user.repository';
import { SendVerifyEmailDTO } from './sendVerifyEmail.dto';
import { VerifyEmailToken } from '../../domain/verifyEmailToken';
import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import * as crypto from 'crypto'
import { RedisAuthService } from '../../services/auth/redisAuth.service';


@Injectable()
export class SendVerifyEmailService {
    constructor(
        private redisAuthService: RedisAuthService,
        private userRepository: UserRepository,
    ) { }

    async send(request: SendVerifyEmailDTO) {
        try {

            const { email } = request
            const emailDomain = UserEmail.create(email)

            const user = await this.userRepository.getUserByEmail(emailDomain)

            const token = crypto.randomBytes(64).toString('hex');
            const date = new Date();

            const verifyEmailTokenPayload = {
                value: token,
                date
            }

            const verifyEmailTokenDomain = VerifyEmailToken.create(verifyEmailTokenPayload)
            console.log(verifyEmailTokenDomain);
            this.redisAuthService.addVerifyEmailToken({ token: verifyEmailTokenDomain.value, userId: user.id })

            //TODO EMAIL
            // try {
            //                 await this.mailerService
            //                     .sendMail({
            //                         to: user.email,
            //                         from: 'ton@pote.dev', // sender address
            //                         subject: 'Inscription sur pote.dev ✔', // Subject line
            //                         text: `Bienvenue ${user.username} sur pote.dev, please confirm email by clicking <a href="${process.env.APP_BASE_URL}/confirm_email/${confirmEmailToken}">confirm email</a> `, // plaintext req
            //                         html: `<b>Bienvenue ${user.username} sur pote.dev, please confirm email by clicking <a href="${process.env.APP_BASE_URL}/confirm_email/${confirmEmailToken}">confirm email</a></b>`, // HTML req content
            //                     })
            //             }
            //             catch (err) {
            //                 //If email isn't sent
            //                 await this.redisHandlerService.client.del(key)
            //                 throw new BadRequestException("Wrong email format");
            //             }
        }
        catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}