import { Global, Module } from '@nestjs/common';
import { RedisHandlerService } from './redis-handler.service';

@Global()
@Module({
  providers: [RedisHandlerService],
  exports: [RedisHandlerService],
})
export class RedisHandlerModule {}