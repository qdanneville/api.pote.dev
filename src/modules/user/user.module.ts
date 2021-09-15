import { Module } from '@nestjs/common';

import { CreateUserModule } from './useCases/createUser/createUser.module'
import { GetUserByEmailModule } from './useCases/getUserByEmail/getUserByEmail.module'
// import { LoginModule } from './useCases/login/login.module'

@Module({
  imports: [CreateUserModule, GetUserByEmailModule],
})

export class UsersModule { }