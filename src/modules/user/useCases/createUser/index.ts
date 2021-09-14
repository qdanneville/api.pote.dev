import { Module } from '@nestjs/common';
import { CreateUser } from './createUser';
import { UserRepository } from '../../user.repository';
import { CreateUserController } from './createUser.controller';

@Module({
  providers: [CreateUser, UserRepository],
  controllers: [CreateUserController],
})
export class CreateUserModule {}