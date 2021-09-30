import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request) => {
                return request?.cookies?.access_token;
            }]),
            passReqToCallback: true,
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(request, payload) {
        const xsrfToken = JSON.parse(request?.headers['x-xsrf-token']);

        console.log('xsrf token from header', xsrfToken)
        console.log('xsrf token from access_token', payload.xsrfToken)

        if (xsrfToken !== payload.xsrfToken) {
            throw new UnauthorizedException('Bad xsrf token')
        }

        // console.log('validate jwt auth guard ?', payload.signedCookies);
        return { userId: payload.sub, username: payload.username, email: payload.email };
    }
}