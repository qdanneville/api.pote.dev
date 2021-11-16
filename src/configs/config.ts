import { Config } from './config.interface';

const config: Config = {
    nest: {
        port: 3000,
    },
    cors: {
        enabled: true,
        origin: 'http://localhost:3001',
        credentials: true
    },
    swagger: {
        enabled: true,
        title: 'pote.dev Swagger',
        description: 'pote.dev | La plateforme pour apprendre à bien coder x)',
        version: '1.5',
        path: 'api',
    },
    security: {
        expiresIn: parseInt(process.env.JWT_EXPIRE_IN),
        refreshIn: parseInt(process.env.JWT_REFRESH_IN),
        jwtSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        bcryptSaltOrRound: 10,
        verifyEmailTokenExpiresIn: process.env.VERIFFY_EMAIL_TOKEN_EXPIRES_IN,
        forgetPasswordExpiresIn: process.env.FORGET_PASSWORD_TOKEN_EXPIRES_IN
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
    },
    prefix: {
        forgetPasswordPrefix: process.env.FORGET_PASSWORD_PREFIX,
        verifyEmailPrefix: process.env.VERIFY_EMAIL_PREFIX
    },
    github: {
        accessTokenUri: process.env.GITHUB_GET_ACCESS_TOKEN_URI,
        userUri: process.env.GITHUB_GET_USER_URI,
        userEmailUri: process.env.GITHUB_GET_USER_EMAIL_URI,
        clientId: process.env.GITHUB_ID,
        secretId: process.env.GITHUB_SECRET,
        redirectUri: process.env.OAUTH_REDIRECT_URI,
        scope: process.env.GITHUB_SCOPE
    }
};

export default (): Config => config;