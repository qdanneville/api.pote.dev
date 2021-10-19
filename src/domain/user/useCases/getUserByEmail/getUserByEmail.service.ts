import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repos/user.repository';

@Injectable()
export class GetUserByEmailService {
    constructor(private readonly usersRepository: UserRepository) { }

    find(email: string, skipError = false, withRole = false) {
        return this.usersRepository.getUserByEmail(email, skipError, withRole);
    }
}