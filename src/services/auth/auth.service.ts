import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { GetUserByEmail } from '../../modules/user/useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from './redis/redis-handler.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
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
        console.log('LOGIN | Creating access & refresh tokens with user : ', user)

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
        const refreshIn = '2m'

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
        console.log('STORING IN REDIS');
        this.redisHandlerService.setUser(user.id, userProperties)

        const keys: string[] = ["role", "confirmed"];
        console.log('user id login : ', user.id)
        const redisUser = await this.redisHandlerService.getFields(user.id, keys);
        console.log('GET USER IN REDIS');
        console.log(redisUser);

        return {
            accessToken,
            expiresIn,
            refreshToken,
            refreshIn,
            xsrfToken
        };
    }

    async refreshToken({ email, refreshToken }) {
        console.log('email', email);
        console.log('refreshToken', refreshToken);

        //Verify if refresh token exists on username
        //First we have to get the id of the user with username

        const user = await this.getUserByEmail.find(email);
        console.log('user', user);

        //Get refresh token in redis with user id
        const keys: string[] = ["refresh_token", "role"];
        console.log('user id refresh : ', user.id)
        const redisUser = await this.redisHandlerService.getFields(user.id, keys);
        console.log('GET USER IN REDIS');
        console.log(redisUser);

        //Check if redis refresh is the same as cookies.refresh
        if (refreshToken !== JSON.parse(redisUser.refresh_token)) {
            throw new UnauthorizedException(
                'Wrong refresh token',
            );
        }

        console.log('refresh matches, creating new access token');
        const xsrfToken = crypto.randomBytes(64).toString('hex');

        const accessPayload = { username: user.username, email: user.email, sub: user.id, xsrfToken };
        const accessSecret = process.env.JWT_SECRET
        const expiresIn = process.env.JWT_EXPIRE_IN

        const accessToken = await this.createJWT(
            accessPayload,
            accessSecret,
            expiresIn
        )

        return {
            accessToken,
            expiresIn,
            xsrfToken
        };
    }

    // TODO seperate auth & redis auth logic
    // REDIS AUTH SERVICE
    async validateJWT(payload): Promise<boolean> {
        const userExists = await this.redisHandlerService.userExists(payload.id);

        //TODO valide JWT and access shit

        if (userExists === false) {
            throw new UnauthorizedException(
                'Wrong JWT & User does not exist in database',
            );
        }

        return true;
    }

    // secret & exp is setted in auth.module.ts in config env
    // default jwt is used as access token, so function only accepts id as param
    async createDefaultJWT(id: string): Promise<string> {
        const payload = { id };
        try {
            return await this.jwtService.sign(payload);
        } catch (err) {
            throw new Error(`Can not create token: ${err.message}`);
        }
    }

    // used for custom tokens, like refresh or confirm token
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