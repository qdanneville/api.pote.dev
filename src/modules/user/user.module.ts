import { Module } from '@nestjs/common';

import { CreateUserModule } from './useCases/createUser/createUser.module'
import { GetUserByEmailModule } from './useCases/getUserByEmail/getUserByEmail.module'
import { GetUsersModule } from './useCases/getUsers/getUsers.module'

@Module({
  imports: [CreateUserModule, GetUserByEmailModule, GetUsersModule],
})

export class UsersModule { }