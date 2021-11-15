import { Injectable, UnauthorizedException, BadGatewayException } from '@nestjs/common';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import * as crypto from 'crypto'

@Injectable()
export class RefreshAccessTokenService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtHandlerService: JwtHandlerService,
        private getUserByEmailService: GetUserByEmailService,
    ) { }

    async refreshToken(refreshToken) {
        const verifiedToken = await this.jwtHandlerService.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user: any = await this.getUserByEmailService.find(verifiedToken.email);
        const keys: string[] = ["refresh_token"];
        const redisUser = await this.redisHandlerService.getFields(user.id, keys);

        if (refreshToken !== JSON.parse(redisUser.refresh_token)) {
            throw new UnauthorizedException(
                'Refresh token not found',
            );
        }

        const xsrfToken = crypto.randomBytes(64).toString('hex');

        const accessPayload = {
            username: user.username,
            email: user.email,
            userId: user.id.toString(),
            xsrfToken,
            confirmed: user.confirmed,
            role: user.role?.name
        };

        const accessSecret = process.env.JWT_SECRET
        const expiresIn = process.env.JWT_EXPIRE_IN

        const accessToken = await this.jwtHandlerService.createJWT(
            accessPayload,
            accessSecret,
            expiresIn
        )

        const refreshPayload = { username: user.username, email: user.email };
        const refreshSecret = process.env.JWT_REFRESH_SECRET
        const refreshIn = process.env.JWT_REFRESH_IN

        const newRefreshToken = await this.jwtHandlerService.createJWT(
            refreshPayload,
            refreshSecret,
            refreshIn
        )

        //TODO generate redis function in authRedisService
        const userProperties = new Map<string, string>([
            ["role", JSON.stringify(user.role?.name)],
            ["confirmed", JSON.stringify(user.confirmed)],
            ["refresh_token", JSON.stringify(newRefreshToken)],
            ["access_token", JSON.stringify(accessToken)],
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
}