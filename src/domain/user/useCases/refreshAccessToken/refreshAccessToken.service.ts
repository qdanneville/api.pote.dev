import { Injectable, UnauthorizedException, BadGatewayException } from '@nestjs/common';
import { GetUserByEmailService } from '../../useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import * as crypto from 'crypto'

@Injectable()
export class RefreshAccessTokenService {
    constructor(
        private redisHandlerService: RedisHandlerService,
        private jwtHandlerService: JwtHandlerService,
        private getUserByEmail: GetUserByEmailService,
    ) { }

    async refreshToken(refreshToken) {
        const verifiedToken = await this.jwtHandlerService.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await this.getUserByEmail.find(verifiedToken.email);
        const keys: string[] = ["refresh_token"];
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

        //TODO - Add correct roles
        const userProperties = new Map<string, string>([
            ["role", "admin"],
            ["confirmed", JSON.stringify(user.confirmed)],
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
}