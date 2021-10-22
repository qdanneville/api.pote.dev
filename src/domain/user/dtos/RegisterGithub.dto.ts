import { IsNotEmpty, IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class RegisterGithubDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    username: string

    @IsBoolean()
    @IsNotEmpty()
    confirmed: boolean

    @IsOptional()
    goals: string[]
}