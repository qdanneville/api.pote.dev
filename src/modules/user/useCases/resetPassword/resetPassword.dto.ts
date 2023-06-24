import { IsNotEmpty, IsString } from 'class-validator';
import { PasswordDto } from "../../dtos/password.dto"

export class ResetPasswordDTO extends PasswordDto {
    @IsNotEmpty()
    @IsString()
    token: string
}