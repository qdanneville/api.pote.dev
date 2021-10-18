import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;

    @IsEmail()
    @IsNotEmpty()
    email: string
}