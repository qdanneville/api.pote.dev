import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisHandlerService } from '../redis/redis-handler.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private redisHandlerService: RedisHandlerService,) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request) => {
                return request?.cookies?.access_token;
            }]),
            passReqToCallback: true,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(request, payload) {

        let xsrfToken;
        let userFound;

        try {
            xsrfToken = request?.headers['x-xsrf-token'];
            userFound = await this.redisHandlerService.userExists(payload.userId)
        }
        catch (err) {
            throw new UnauthorizedException()
        }

        if (!userFound) {
            throw new UnauthorizedException('Auth token not found. User is probably not logged in. Please login again.')
        }

        if (!xsrfToken || xsrfToken !== payload.xsrfToken) {
            throw new UnauthorizedException('Bad xsrf token')
        }

        return { userId: payload.userId, username: payload.username, email: payload.email, role: payload.roleName, verified: payload.isEmailVerified };
    }
}