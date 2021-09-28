import { Config } from './config.interface';

const config: Config = {
    nest: {
        port: 3000,
    },
    cors: {
        enabled: true,
        origin: 'http://localhost:1234',
        credentials: true
    },
    swagger: {
        enabled: true,
        title: 'pote.dev Swagger',
        description: 'pote.dev description',
        version: '1.5',
        path: 'api',
    },
    security: {
        expiresIn: parseInt(process.env.JWT_EXPIRE_IN),
        refreshIn: parseInt(process.env.JWT_REFRESH_IN),
        jwtSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        bcryptSaltOrRound: 10,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
    },
};

export default (): Config => config;