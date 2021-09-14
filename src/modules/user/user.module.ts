import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CreateUserModule } from './useCases/createUser'

@Module({
  imports: [CreateUserModule],
})

export class UserModule { }