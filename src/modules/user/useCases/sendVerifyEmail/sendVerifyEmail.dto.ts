import { IsEmail, IsNotEmpty } from "class-validator"

export class SendVerifyEmailDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string
}