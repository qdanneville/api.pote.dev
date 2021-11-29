export interface Config {
    nest: NestConfig;
    cors: CorsConfig;
    swagger: SwaggerConfig;
    security: SecurityConfig;
    redis: RedisConfig;
    github: GithubConfig;
    prefix: PrefixConfig
}

export interface NestConfig {
    port: number;
}

export interface CorsConfig {
    enabled: boolean;
    origin: string;
    credentials: boolean;
}

export interface SwaggerConfig {
    enabled: boolean;
    title: string;
    description: string;
    version: string;
    path: string;
}

export interface SecurityConfig {
    expiresIn: number;
    refreshIn: number;
    jwtSecret: string;
    refreshSecret: string;
    bcryptSaltOrRound: string | number;
    verifyEmailTokenExpiresIn: string;
    forgotPasswordTokenExpiresIn: string;
}

export interface RedisConfig {
    host: string;
    port: number;
    db: number;
    password: string;

}

export interface PrefixConfig {
    forgotPasswordPrefix: string;
    verifyEmailPrefix: string
}

export interface GithubConfig {
    accessTokenUri: string,
    userUri: string,
    userEmailUri: string,
    clientId: string,
    secretId: string,
    redirectUri: string,
    scope: string
}