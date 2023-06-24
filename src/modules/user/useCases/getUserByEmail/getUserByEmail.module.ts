import { Module } from '@nestjs/common';
import { GetUserByEmailService } from './getUserByEmail.service';
import { UserRepository } from '../../repos/user.repository';
import { GetUserByEmailController } from './getUserByEmail.controller';

@Module({
    providers: [GetUserByEmailService, UserRepository],
    controllers: [GetUserByEmailController],
    exports: [GetUserByEmailService],
})
export class GetUserByEmailModule { }