import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user.repository';

@Injectable()
export class GetUsers {
    constructor(private readonly usersRepository: UserRepository) { }

    find() {
        return this.usersRepository.getUsers();
    }
}