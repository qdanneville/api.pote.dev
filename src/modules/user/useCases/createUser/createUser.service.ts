import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../repos/user.repository';
import { RoleRepository } from '../../repos/role.repository';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto'
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';

import { CreateUserDTO } from './createUser.dto';
import { UserEmail } from '../../domain/userEmail';
import { UserUsername } from '../../domain/userUsername';
import { UserPassword } from '../../domain/userPassword';
import { User } from '../../domain/user';
import { UserRole } from '../../domain/userRole';

//TODO Make INTERFACE FOR USERREPO
//TODO Make INTERFACE FOR REDISHANDLERSERVICE
//TODO Make INTERFACE FOR MAILERSERVICE

@Injectable()
export class CreateUserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly redisHandlerService: RedisHandlerService,
        private readonly mailerService: MailerService
    ) { }

    //TODO return promise error or value
    async create(req: CreateUserDTO): Promise<any> {

        // let user;

        const emailDomain = UserEmail.create(req.email)
        const usernameDomain = await UserUsername.create(req.username)
        const passwordDomain = UserPassword.create({ value: req.password });
        const defaultUserRole = await this.roleRepository.getDefaultUserRole()
        const roleDomain = UserRole.create({ roleId: defaultUserRole.id, name: defaultUserRole.name })

        const email = emailDomain.value;
        const username = usernameDomain.value;
        const password = await passwordDomain.getHashedValue();
        const role = roleDomain.name

        try {
            const userAlreadyExists = await this.userRepository.exists(emailDomain)

            if (userAlreadyExists) {
                throw 'This email is already taken';
            }

            const usernameIsTaken = await this.userRepository.getUserByUserName(usernameDomain.props.value)

            if (usernameIsTaken) {
                throw 'This username is already taken';
            }

            const userDomain: User = User.create({
                email: emailDomain,
                username: usernameDomain,
                password: passwordDomain,
                role: roleDomain
            })

            await this.userRepository.createUser(userDomain)

            console.log(userDomain);

        } catch (err) {
            throw new BadRequestException(err);
        }

        //     if (!oauth) {
        //         const hashedPassword = await bcrypt.hash(req.password, 10);
        //         req.password = hashedPassword
        //     }

        //     user = await this.usersRepository.createUser(req);

        //     if (user) {
        //         if (!req.confirmed) {
        //             const confirmEmailToken = crypto.randomBytes(64).toString('hex');

        //             const key = process.env.CONFIRM_EMAIL_PREFIX + confirmEmailToken

        //             await this.redisHandlerService.client.set(
        //                 key,
        //                 user.id,
        //                 'ex',
        //                 process.env.CONFIRM_EMAIL_TOKEN_EXPIRES_IN
        //             )

        //             try {
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
        //         } else {
        //             try {
        //                 await this.mailerService
        //                     .sendMail({
        //                         to: user.email,
        //                         from: 'ton@pote.dev', // sender address
        //                         subject: 'Inscription sur pote.dev ✔', // Subject line
        //                         text: `Bienvenue ${user.username} sur pote.dev`, // plaintext body
        //                         html: `<b>Bienvenue ${user.username} sur pote.dev`, // HTML body content
        //                     })
        //             }
        //             catch (err) {
        //                 //If email isn't sent
        //                 throw new BadRequestException("Wrong email format");
        //             }
        //         }
        //     }
        // }
        // catch (err) {
        //     console.log(err);
        //     throw new BadRequestException(err.message);
        // }
        // //TODO do we register a user if the mail isn't set ?
        // return user
    }
}