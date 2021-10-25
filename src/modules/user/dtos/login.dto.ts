import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
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