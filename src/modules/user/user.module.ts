import { Module } from '@nestjs/common';

import { CreateUserModule } from './useCases/createUser/createUser.module'
import { GetUserByEmailModule } from './useCases/getUserByEmail/getUserByEmail.module'

@Module({
  imports: [CreateUserModule, GetUserByEmailModule],
})

export class UsersModule { }