import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { GetUserByEmail } from '../../modules/user/useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from './redis/redis-handler.service';
import { MailerService } from '@nestjs-modules/mailer';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { UserRepository } from 'src/modules/user/user.repository';
import { JwtHandlerService } from './jwt/jwt-handler.service';

@Injectable()
export class AuthService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        // private jwtService: JwtService,
        private jwtHandlerService: JwtHandlerService,
        private getUserByEmail: GetUserByEmail,
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

        const refreshToken = await this.jwtHandlerService.createJWT(
            refreshPayload,
            refreshSecret,
            refreshIn
        )

        const userProperties = new Map<string, string>([
            ["role", "admin"],
            ["confirmed", "false"],
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
            'FORGET_PASSWORD_' + forgotPasswordToken,
            user.id,
            'ex',
            1000 * 60 //60s
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

        const key = "FORGET_PASSWORD_" + body.token;
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

    async currentUser(email) {
        return this.getUserByEmail.find(email);
    }


    // TODO seperate auth & redis auth logic
    // REDIS AUTH SERVICE
    // async validateJWT(payload): Promise<boolean> {
    //     const userExists = await this.redisHandlerService.userExists(payload.id);

    //     if (userExists === false) {
    //         throw new UnauthorizedException(
    //             'Wrong JWT & User does not exist in database',
    //         );
    //     }

    //     return true;
    // }

    // async createDefaultJWT(id: string): Promise<string> {
    //     const payload = { id };
    //     try {
    //         return await this.jwtService.sign(payload);
    //     } catch (err) {
    //         throw new Error(`Can not create token: ${err.message}`);
    //     }
    // }

    // async jwtHandlerService.createJWT(
    //     payload: any,
    //     secret: string,
    //     expiresIn: string,
    // ): Promise<string> {
    //     try {
    //         return await this.jwtService.sign(payload, {
    //             secret,
    //             expiresIn,
    //         });
    //     } catch (err) {
    //         throw new Error(`Can not create token: ${err.message}`);
    //     }
    // }

    // async verifyToken(token, secret): Promise<any> {
    //     try {
    //         return await this.jwtService.verify(token, { secret });
    //     } catch (err) {
    //         throw new UnauthorizedException(err.message);
    //     }
    // }
}