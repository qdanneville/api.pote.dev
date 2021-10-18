import { IsNotEmpty, IsEmail } from 'class-validator';

export class GetUserByEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
}