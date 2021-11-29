import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string
}

export interface forgotPasswordResponse {
    token: string
}