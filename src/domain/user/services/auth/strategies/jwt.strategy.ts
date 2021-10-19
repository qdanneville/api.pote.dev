import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
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
        //TODO, verify if user still exists in db with redit
        const xsrfToken = request?.headers['x-xsrf-token'];

        if (!xsrfToken && xsrfToken !== payload.xsrfToken) {
            throw new UnauthorizedException('Bad xsrf token')
        }

        return { userId: payload.userId, username: payload.username, email: payload.email, role: payload.role, confirmed: payload.confirmed };
    }
}