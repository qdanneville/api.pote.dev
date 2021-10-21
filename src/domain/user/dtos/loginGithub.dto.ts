import { IsNotEmpty, IsString } from 'class-validator';

export class LoginGithubDto {
    @IsString()
    @IsNotEmpty()
    code: string
}