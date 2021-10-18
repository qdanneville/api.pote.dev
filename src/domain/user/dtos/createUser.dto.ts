import { IsNotEmpty, IsEmail, IsString, validate } from 'class-validator';
import { PasswordDto } from './password.dto';

export class CreateUserDto extends PasswordDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string
}