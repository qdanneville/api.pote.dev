import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AccessToken, AccessTokenClaims } from "../../domain/accessToken";
import { RefreshToken, RefreshTokenClaims } from "../../domain/refreshToken";
import { JwtHandlerService } from "./jwt/jwt-handler.service";
import { RedisHandlerService } from "./redis/redis-handler.service";
import * as crypto from 'crypto'


//Domain
import { XsrfToken } from "../../domain/xsrfToken";
import { User } from "../../domain/user";
import { VerifyEmailTokenClaim } from "../../domain/verifyEmailToken";
import { ForgotPasswordTokenClaim } from "../../domain/forgotPasswordToken";
import { RedisUser } from "../../domain/userRedis";

@Injectable()
export class RedisAuthService {

    constructor(
        private configService: ConfigService,
        private readonly jwtHandlerService: JwtHandlerService,
        private readonly redisHandlerService: RedisHandlerService
    ) { }

    public createXsrfToken(): XsrfToken {
        return crypto.randomBytes(64).toString('hex') as XsrfToken;
    }

    public async createAccessToken(props: AccessTokenClaims): Promise<AccessToken> {
        const accessSecret = this.configService.get<string>('security.jwtSecret');
        const expiresIn = this.configService.get<string>('security.expiresIn');

        const claims: AccessTokenClaims = {
            userId: props.userId,
            isEmailVerified: props.isEmailVerified,
            email: props.email,
            username: props.email,
            isAdmin: props.isAdmin,
            roleName: props.roleName,
            xsrfToken: props.xsrfToken
        }

        return this.jwtHandlerService.createJWT(
            claims,
            accessSecret,
            expiresIn
        )
    }

    public async createRefreshToken(props: RefreshTokenClaims): Promise<RefreshToken> {
        const refreshSecret = this.configService.get<string>('security.refreshSecret');
        const refreshIn = this.configService.get<string>('security.refreshIn');

        const claims: RefreshTokenClaims = {
            email: props.email,
            username: props.username,
        }

        return this.jwtHandlerService.createJWT(
            claims,
            refreshSecret,
            refreshIn
        )
    }

    public addRedisUser(props: User): Promise<any> {
        //TODO generate redis function in authRedisService
        //Todo Object.fromEntries(redisUSER)
        const userProperties = new Map<string, string>([
            ["accessToken", JSON.stringify(props.accessToken)],
            ["refreshToken", JSON.stringify(props.refreshToken)],
            ["role", JSON.stringify(props.role)],
            ["isEmailVerified", JSON.stringify(props.isEmailVerified)],
        ]);

        const expiresIn = this.configService.get<number>('security.refreshIn');

        return this.redisHandlerService.setUser(props.id.toString(), userProperties, expiresIn)
    }

    public verifyRefreshToken(token: string) {
        const refreshSecret = this.configService.get<string>('security.refreshSecret');
        return this.jwtHandlerService.verifyToken(token, refreshSecret)
    }



    public addVerifyEmailToken(props: VerifyEmailTokenClaim): Promise<any> {
        let key = this.configService.get<string>('prefix.verifyEmailPrefix');
        key = key + props.token
        const expiresIn = this.configService.get<string>('security.verifyEmailTokenExpiresIn')
        const userId = props.userId.toString()

        return this.redisHandlerService.client.set(key, userId, 'EX', expiresIn)
    }

    public addForgotPasswordToken(props: ForgotPasswordTokenClaim): Promise<any> {
        let key = this.configService.get<string>('prefix.forgotPasswordPrefix');
        key = key + props.token
        const expiresIn = this.configService.get<string>('security.forgotPasswordTokenExpiresIn')
        const userId = props.userId.toString()

        return this.redisHandlerService.client.set(key, userId, 'EX', expiresIn)
    }

    public async getUserIdFromEmailVerificationToken(emailVerificationToken: string): Promise<string> {
        let key = this.configService.get<string>('prefix.verifyEmailPrefix');
        key = key + emailVerificationToken
        const userId = await this.redisHandlerService.client.get(key);

        if (!userId) {
            throw new BadRequestException("User not found for this email verification token")
        }

        return userId
    }

    public async getUserIdFromForgotPasswordToken(ForgotPasswordToken: string): Promise<string> {
        let key = this.configService.get<string>('prefix.forgotPasswordPrefix');
        key = key + ForgotPasswordToken
        const userId = await this.redisHandlerService.client.get(key);

        if (!userId) {
            throw new BadRequestException("User not found for this forgot password token")
        }

        return userId
    }

    public getRedisRefreshTokenField(userId: string) {
        const fields: string[] = ["refreshToken"];
        return this.redisHandlerService.getFields(userId, fields);
    }

    public delVerifyEmailTokenKey(emailVerificationToken: string) {
        let key = this.configService.get<string>('prefix.verifyEmailPrefix');
        key = key + emailVerificationToken
        return this.redisHandlerService.client.del(key)
    }

    public delForgotPasswordTokenKey(forgotPasswordToken: string) {
        let key = this.configService.get<string>('prefix.forgotPasswordPrefix');
        key = key + forgotPasswordToken
        return this.redisHandlerService.client.del(key)
    }
}