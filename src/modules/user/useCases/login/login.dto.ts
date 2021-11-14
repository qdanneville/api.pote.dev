import { AccessToken } from "../../domain/accessToken"
import { RefreshToken } from "../../domain/refreshToken"

export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginDTOResponse {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
}