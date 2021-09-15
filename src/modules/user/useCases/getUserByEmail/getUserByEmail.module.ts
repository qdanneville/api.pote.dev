import { Module } from '@nestjs/common';
import { GetUserByEmail } from './getUserByEmail.service';
import { UserRepository } from '../../user.repository';
import { GetUserByEmailController } from './getUserByEmail.controller';

@Module({
    providers: [GetUserByEmail, UserRepository],
    controllers: [GetUserByEmailController],
    exports: [GetUserByEmail],
})
export class GetUserByEmailModule { }