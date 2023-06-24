import { Injectable, UnauthorizedException, BadGatewayException, BadRequestException } from '@nestjs/common';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';
import * as crypto from 'crypto'
import { RedisAuthService } from '../../services/auth/redisAuth.service';
import { UserRepository } from '../../repos/user.repository';
import { RefreshAccessTokenDTO } from './refreshAccessToken.dto';
import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';

@Injectable()
export class RefreshAccessTokenService {
    constructor(
        private redisAuthService: RedisAuthService,
        private userRepository: UserRepository,
    ) { }

    async refreshToken(req: RefreshAccessTokenDTO) {

        const { refreshToken } = req
        let user: User;
        let verifiedToken;

        try {
            verifiedToken = await this.redisAuthService.verifyRefreshToken(refreshToken)
        }
        catch (err) {
            throw new BadRequestException("Refresh token expired");
        }

        try {
            const emailDomain = UserEmail.create(verifiedToken.email)
            user = await this.userRepository.getUserByEmail(emailDomain)
        }
        catch (err) {
            console.log('err', err)
            throw new BadRequestException("User no longer exists");
        }

        const redisRefreshToken = await this.redisAuthService.getRedisRefreshTokenField(user.id.toString())
        
        if (refreshToken !== JSON.parse(redisRefreshToken.refreshToken)) {
            throw new BadRequestException("User not found for this refresh token");
        }

        const xsrfToken = this.redisAuthService.createXsrfToken()

        //CARE
        //We might want the role name here
        //TO CHECK
        const accessPayload = {
            username: user.username.value,
            email: user.email.value,
            userId: user.id.toString(),
            xsrfToken,
            isEmailVerified: user.isEmailVerified,
            isAdmin: user.isAdmin,
            roleName: user.role.name,
        };

        const accessToken = await this.redisAuthService.createAccessToken(accessPayload)

        const refreshPayload = { username: user.username.value, email: user.email.value };
        const newRefreshToken = await this.redisAuthService.createRefreshToken(refreshPayload)

        user.setAccessToken(accessToken, refreshToken)

        await this.redisAuthService.addRedisUser(user)

        return {
            accessToken,
            refreshToken: newRefreshToken,
            xsrfToken
        };
    }
}