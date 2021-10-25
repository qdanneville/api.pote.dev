import { Module } from '@nestjs/common';
import { CreateUserService } from './createUser.service';
import { UserRepository } from '../../repos/user.repository';
import { CreateUserController } from './createUser.controller';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { RoleRepository } from '../../repos/role.repository';

@Module({
  providers: [CreateUserService, UserRepository, RoleRepository, RedisHandlerService],
  controllers: [CreateUserController],
  exports: [CreateUserService]
})
export class CreateUserModule { }