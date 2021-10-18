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
        const xsrfToken = request?.headers['x-xsrf-token'] ? JSON.parse(request?.headers['x-xsrf-token']) : null;

        if (xsrfToken !== payload.xsrfToken) {
            throw new UnauthorizedException('Bad xsrf token')
        }

        //TODO return correct user roles
        return { userId: payload.sub, username: payload.username, email: payload.email, roles: ['admin'], confirmed:payload.confirmed};
    }
}