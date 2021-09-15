import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user.repository';

@Injectable()
export class GetUserByEmail {
    constructor(private readonly usersRepository: UserRepository) { }

    find(email: string) {
        return this.usersRepository.getUserByEmail(email);
    }
}