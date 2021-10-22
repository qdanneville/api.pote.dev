import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class RegisterGithubDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    formToken: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    goals: string[]
}