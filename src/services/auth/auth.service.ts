import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GetUserByEmail } from '../../modules/user/useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from './redis/redis-handler.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtService: JwtService,
        private getUserByEmail: GetUserByEmail,
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

        const accessToken = await this.createJWT(
            accessPayload,
            accessSecret,
            expiresIn
        )

        const refreshPayload = { username: user.username, sub: user.id };
        const refreshSecret = process.env.JWT_REFRESH_SECRET
        const refreshIn = process.env.JWT_REFRESH_IN

        const refreshToken = await this.createJWT(
            refreshPayload,
            refreshSecret,
            refreshIn
        )

        const userProperties = new Map<string, string>([
            ["role", "admin"],
            ["confirmed", "false"],
            ["refresh_token", JSON.stringify(refreshToken)],
        ]);

        //Storing in redis
        this.redisHandlerService.setUser(user.id, userProperties)

        return {
            accessToken,
            expiresIn,
            refreshToken,
            refreshIn,
            xsrfToken
        };
    }

    async refreshToken({ email, refreshToken }) {

        await this.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)

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

        const accessToken = await this.createJWT(
            accessPayload,
            accessSecret,
            expiresIn
        )

        const refreshPayload = { username: user.username, sub: user.id };
        const refreshSecret = process.env.JWT_REFRESH_SECRET
        const refreshIn = process.env.JWT_REFRESH_IN

        const newRefreshToken = await this.createJWT(
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

    async createDefaultJWT(id: string): Promise<string> {
        const payload = { id };
        try {
            return await this.jwtService.sign(payload);
        } catch (err) {
            throw new Error(`Can not create token: ${err.message}`);
        }
    }

    async createJWT(
        payload: any,
        secret: string,
        expiresIn: string,
    ): Promise<string> {
        try {
            return await this.jwtService.sign(payload, {
                secret,
                expiresIn,
            });
        } catch (err) {
            throw new Error(`Can not create token: ${err.message}`);
        }
    }

    async verifyToken(token, secret): Promise<any> {
        try {
            return await this.jwtService.verify(token, { secret });
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
    }
}