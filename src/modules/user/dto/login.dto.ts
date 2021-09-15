import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string;
}