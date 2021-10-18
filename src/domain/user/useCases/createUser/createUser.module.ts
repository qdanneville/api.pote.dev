import { Module } from '@nestjs/common';
import { CreateUserService } from './createUser.service';
import { UserRepository } from '../../repos/user.repository';
import { CreateUserController } from './createUser.controller';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';

@Module({
  providers: [CreateUserService, UserRepository, RedisHandlerService],
  controllers: [CreateUserController],
  exports:[CreateUserService]
})
export class CreateUserModule {}