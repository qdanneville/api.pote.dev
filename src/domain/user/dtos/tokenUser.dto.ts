import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

//TODO role
export class TokenUserDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsEmail()
    @IsNotEmpty()
    email: string
}