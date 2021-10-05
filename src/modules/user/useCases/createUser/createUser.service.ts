import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUser {
    constructor(
        private readonly usersRepository: UserRepository,
        private readonly mailerService: MailerService
    ) { }

    async create(body) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword

        const user = await this.usersRepository.createUser(body);

        if (user) {
            try {
                await this.mailerService
                    .sendMail({
                        to: user.email,
                        from: 'ton@pote.dev', // sender address
                        subject: 'Inscription sur pote.dev ✔', // Subject line
                        text: `Bienvenue ${user.firstname} sur pote.dev`, // plaintext body
                        html: `<b>Bienvenue ${user.firstname} sur pote.dev</b>`, // HTML body content
                    })
            }
            catch (err) {
                throw new BadRequestException("Wrong email format");
            }
        }

        return user
    }
}