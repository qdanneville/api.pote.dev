import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../repos/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';

@Injectable()
export class CreateUserService {
    constructor(
        private readonly usersRepository: UserRepository,
        private readonly redisHandlerService: RedisHandlerService,
        private readonly mailerService: MailerService
    ) { }

    async create(body) {

        let user;

        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            body.password = hashedPassword

            user = await this.usersRepository.createUser(body);

            if (user) {
                const confirmEmailToken = crypto.randomBytes(64).toString('hex');

                const key = process.env.CONFIRM_EMAIL_PREFIX + confirmEmailToken

                await this.redisHandlerService.client.set(
                    key,
                    user.id,
                    'ex',
                    process.env.CONFIRM_EMAIL_TOKEN_EXPIRES_IN
                )

                try {
                    await this.mailerService
                        .sendMail({
                            to: user.email,
                            from: 'ton@pote.dev', // sender address
                            subject: 'Inscription sur pote.dev ✔', // Subject line
                            text: `Bienvenue ${user.firstname} sur pote.dev, please confirm email by clicking <a href="${process.env.APP_BASE_URL}/confirm_email/${confirmEmailToken}">confirm email</a> `, // plaintext body
                            html: `<b>Bienvenue ${user.firstname} sur pote.dev, please confirm email by clicking <a href="${process.env.APP_BASE_URL}/confirm_email/${confirmEmailToken}">confirm email</a></b>`, // HTML body content
                        })
                }
                catch (err) {
                    //If email isn't sent
                    await this.redisHandlerService.client.del(key)
                    throw new BadRequestException("Wrong email format");
                }
            }
        }
        catch (err) {
            console.log(err);
            throw new BadRequestException("Registration failed");
        }
        //TODO do we register a user if the mail isn't set ?
        return user
    }
}