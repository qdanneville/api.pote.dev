import { Global, Module } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { RedisHandlerService } from './redis-handler.service';
import { RedisModule } from "nestjs-redis";

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigService],
      useFactory: (config: ConfigService) => config.get("redis"),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisHandlerService],
  exports: [RedisHandlerService],
})
export class RedisHandlerModule { }