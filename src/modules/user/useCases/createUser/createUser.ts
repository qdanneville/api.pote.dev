import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/createUser.dto';
import { UserRepository } from '../../user.repository';

@Injectable()
export class CreateUser {
    constructor(private readonly usersRepository: UserRepository) { }

    create(user: CreateUserDto) {
        return this.usersRepository.createUser(user);
    }
}