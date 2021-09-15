// import { Injectable } from '@nestjs/common';
// import { TokenUserDto } from '../../dto/tokenUser.dto';
// import { UserRepository } from '../../user.repository';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class Login {
//     constructor(private readonly usersRepository: UserRepository) { }

//     log(user: TokenUserDto) {
//         const payload = { email: user.email, sub: user.id }

//         return {
//             access_token: this.jwtService.sign(payload),
//         };
//     }
// }