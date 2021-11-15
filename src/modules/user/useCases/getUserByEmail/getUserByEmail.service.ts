import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../repos/user.repository';
import { UserEmail } from '../../domain/userEmail';
import { GetUserByEmailDTO } from './getUserByEmail.dto';
import { User } from '../../domain/user';

@Injectable()
export class GetUserByEmailService {
    constructor(private readonly usersRepository: UserRepository) { }

    async find(request: GetUserByEmailDTO) {

        let user: User
        const emailDomain = UserEmail.create(request.email)

        try {
            user = await this.usersRepository.getUserByEmail(emailDomain);
        } catch (err) {
            console.log(err);
            throw new BadRequestException(err.message)
        }

        return user
    }
}