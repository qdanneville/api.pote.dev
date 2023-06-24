import { IsNotEmpty, IsString } from 'class-validator';

export class CheckGithubUserDto {
    @IsString()
    @IsNotEmpty()
    code: string
}