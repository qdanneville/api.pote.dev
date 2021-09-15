import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/createUser.dto';
import { UserRepository } from '../../user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUser {
    constructor(private readonly usersRepository: UserRepository) { }

    async create(user: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword

        return this.usersRepository.createUser(user);
    }
}