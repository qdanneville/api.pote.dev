// import { AbstractRedisClient } from './redisAbstract.service'
// import { RedisClient } from 'redis';
// import { JwtService } from '@nestjs/jwt';
// import randtoken from 'rand-token'
// import { Injectable } from '@nestjs/common';
// // import { AUTH_SECRET, TOKEN_EXPIRE_TIME } from '../../../../constant';

// interface saveUserProps {
//     username: string,
//     refreshToken: string,
//     accessToken: string,
//     xsrfToken: string
// }

// interface jwtProps {
//     email: string,
//     username: string,
//     userId: string,
//     xsrfToken: string
// }

// @Injectable()
// export class RedisAuthService extends AbstractRedisClient {

//     public jwtHashName: string = 'activeJwtClients';
//     private jwtService: JwtService

//     constructor(redisClient: RedisClient) {
//         super(redisClient);
//     }

//     //Add to redis information about user : refresh & access token
//     public async saveAuthenticatedUser(user: saveUserProps): Promise<void> {
//         await this.addToken(user.username, user.refreshToken, user.accessToken, user.xsrfToken);
//     }

//     public createRefreshToken(): string {
//         return randtoken.uid(256) as string;
//     }

//     public createXsrfToken(): string {
//         return randtoken.uid(64) as string;
//     }

//     public signJWT(props: jwtProps): string {
//         const claims = {
//             email: props.email,
//             username: props.username,
//             userId: props.userId,
//             xsrfToken: props.xsrfToken
//         };

//         return this.jwtService.sign(claims)
//     }

//     public decodeJWT(token: string): Promise<object | null> {
//         return new Promise((resolve, _) => {
//             this.jwtService.verify(token) => {
//                 if (err) return resolve(null);
//                 return resolve(decoded);
//             });
//         })
//     }

//     private constructKey(username: string, refreshToken: string): string {
//         return `refresh-${refreshToken}.${this.jwtHashName}.${username}`
//     }

//     public addToken(username: string, refreshToken: string, token: string, xsrfToken: string): Promise<any> {
//         return this.set(this.constructKey(username, refreshToken), xsrfToken);
//     }

//     public async getTokens(username: string): Promise<string[]> {
//         const keyValues = await this.getAllKeyValue(`*${this.jwtHashName}.${username}`);
//         return keyValues.map((kv) => kv.value);
//     }

//     public async getToken(username: string, refreshToken: string): Promise<string> {
//         return this.getOne(this.constructKey(username, refreshToken));
//     }
// }