import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { GetUserByEmailService } from '../../useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from './redis/redis-handler.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { UserRepository } from 'src/domain/user/repos/user.repository';
import { JwtHandlerService } from './jwt/jwt-handler.service';

@Injectable()
export class AuthService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtHandlerService: JwtHandlerService,
        private getUserByEmail: GetUserByEmailService,
        private userRepo: UserRepository,
        private readonly mailerService: MailerService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {

        const user = await this.getUserByEmail.find(email);
        const passwordsMatch = await bcrypt.compare(pass, user.password);

        if (user && passwordsMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const xsrfToken = crypto.randomBytes(64).toString('hex');

        const accessPayload = { username: user.username, email: user.email, sub: user.id, xsrfToken, confirmed: user.confirmed };
        const accessSecret = process.env.JWT_SECRET
        const expiresIn = process.env.JWT_EXPIRE_IN

        const accessToken = await this.jwtHandlerService.createJWT(
            accessPayload,
            accessSecret,
            expiresIn
        )

        const refreshPayload = { username: user.username, sub: user.id };
        const refreshSecret = process.env.JWT_REFRESH_SECRET
        const refreshIn = process.env.JWT_REFRESH_IN

        const refreshToken = await this.jwtHandlerService.createJWT(
            refreshPayload,
            refreshSecret,
            refreshIn
        )

        const userProperties = new Map<string, string>([
            ["role", "admin"],
            ["refresh_token", JSON.stringify(refreshToken)],
        ]);

        this.redisHandlerService.setUser(user.id, userProperties)

        return {
            accessToken,
            expiresIn,
            refreshToken,
            refreshIn,
            xsrfToken
        };
    }

    async forgotPassword(email) {
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

        return
    }

    async resetPassword(body) {
        if (body.password !== body.password_copy) {
            throw new BadRequestException("Passwords don't match");
        }

        const key = process.env.FORGET_PASSWORD_PREFIX + body.token;
        const userId = await this.redisHandlerService.client.get(key);

        if (!userId) {
            throw new BadRequestException("Token expired");
        }

        const user = await this.userRepo.getUserById(userId)

        if (!user) {
            throw new BadRequestException("User no longer exists");
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        await this.userRepo.changePassword(userId, hashedPassword)

        await this.redisHandlerService.client.del(key)

        return { user }
    }

    async refreshToken({ email, refreshToken }) {

        await this.jwtHandlerService.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await this.getUserByEmail.find(email);
        const keys: string[] = ["refresh_token", "role"];
        const redisUser = await this.redisHandlerService.getFields(user.id, keys);

        if (refreshToken !== JSON.parse(redisUser.refresh_token)) {
            throw new UnauthorizedException(
                'Wrong refresh token',
            );
        }

        const xsrfToken = crypto.randomBytes(64).toString('hex');

        const accessPayload = { username: user.username, email: user.email, sub: user.id, xsrfToken };
        const accessSecret = process.env.JWT_SECRET
        const expiresIn = process.env.JWT_EXPIRE_IN

        const accessToken = await this.jwtHandlerService.createJWT(
            accessPayload,
            accessSecret,
            expiresIn
        )

        const refreshPayload = { username: user.username, sub: user.id };
        const refreshSecret = process.env.JWT_REFRESH_SECRET
        const refreshIn = process.env.JWT_REFRESH_IN

        const newRefreshToken = await this.jwtHandlerService.createJWT(
            refreshPayload,
            refreshSecret,
            refreshIn
        )

        const userProperties = new Map<string, string>([
            ["role", "admin"],
            ["confirmed", "false"],
            ["refresh_token", JSON.stringify(newRefreshToken)],
        ]);

        this.redisHandlerService.setUser(user.id, userProperties)

        return {
            accessToken,
            expiresIn,
            refreshToken: newRefreshToken,
            refreshIn,
            xsrfToken
        };
    }

    // async confirmEmail(body) {
    //     const key = process.env.CONFIRM_EMAIL_PREFIX + body.token;
    //     const userId = await this.redisHandlerService.client.get(key);

    //     if (!userId) {
    //         throw new BadRequestException("Token expired");
    //     }

    //     const user = await this.userRepo.getUserById(userId)

    //     if (!user) {
    //         throw new BadRequestException("User no longer exists");
    //     }

    //     await this.userRepo.confirmUser(userId)

    //     await this.redisHandlerService.client.del(key)

    //     return
    // }
}