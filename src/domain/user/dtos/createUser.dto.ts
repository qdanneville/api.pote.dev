import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { PasswordDto } from './password.dto';

export class CreateUserDto extends PasswordDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string
}