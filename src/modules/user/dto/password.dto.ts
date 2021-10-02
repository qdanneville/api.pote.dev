import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class PasswordDto {
    @MinLength(6, {
        message: 'Password is too short',
    })
    @MaxLength(15, {
        message: 'Password is too long',
    })
    @IsString()
    @IsNotEmpty()
    password: string

    @MinLength(6, {
        message: 'Password copy is too short',
    })
    @MaxLength(15, {
        message: 'Password copy is too long',
    })
    @IsString()
    @IsOptional()
    password_copy: string
}