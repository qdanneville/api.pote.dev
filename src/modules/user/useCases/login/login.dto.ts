import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { AccessToken } from "../../domain/accessToken"
import { RefreshToken } from "../../domain/refreshToken"

export class LoginDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @MinLength(6, {
        message: 'Password is too short',
    })
    @MaxLength(15, {
        message: 'Password is too long',
    })
    @IsString()
    @IsNotEmpty()
    password: string
}

export interface LoginDTOResponse {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
}