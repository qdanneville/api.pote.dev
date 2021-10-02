import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { PasswordDto } from './password.dto';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
    password: PasswordDto;
}