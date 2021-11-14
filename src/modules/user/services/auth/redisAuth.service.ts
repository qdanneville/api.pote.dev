import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AccessToken, AccessTokenClaims } from "../../domain/accessToken";
import { RefreshToken, RefreshTokenClaims } from "../../domain/refreshToken";
import { RedisUser } from "../../domain/userRedis";
import { JwtHandlerService } from "./jwt/jwt-handler.service";
import { RedisHandlerService } from "./redis/redis-handler.service";
import * as crypto from 'crypto'
import { XsrfToken } from "../../domain/xsrfToken";
import { User } from "../../domain/user";

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
            roleId: props.roleId,
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
            username: props.email,
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

        return this.redisHandlerService.setUser(props.id.toString(), userProperties)
    }
}