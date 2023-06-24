import { IsNotEmpty, IsEmail } from 'class-validator';

// export interface GetUserByEmailDTO {
//     email: string
// }

export class GetUserByEmailDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string
}