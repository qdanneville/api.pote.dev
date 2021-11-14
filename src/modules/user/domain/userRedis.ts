import { AccessToken } from "./accessToken";
import { RefreshToken } from "./refreshToken";

export interface RedisUser {
    email: string;
    username: string;
    accessToken: AccessToken,
    refreshToken: RefreshToken
    role: string,
    isEmailVerified: boolean
};