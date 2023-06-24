import { IsNotEmpty, IsString } from 'class-validator';

export class CheckGithubUserDTO {
    @IsString()
    @IsNotEmpty()
    code: string
}