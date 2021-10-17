import { Module } from '@nestjs/common';
import { CreateUser } from './createUser.service';
import { UserRepository } from '../../user.repository';
import { CreateUserController } from './createUser.controller';
import { RedisHandlerService } from 'src/services/auth/redis/redis-handler.service';

@Module({
  providers: [CreateUser, UserRepository, RedisHandlerService],
  controllers: [CreateUserController],
})
export class CreateUserModule {}