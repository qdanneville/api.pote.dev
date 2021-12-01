import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "nestjs-redis";

@Injectable()
export class RedisHandlerService {
  client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.getRedisClient();
  }

  getRedisClient(): Redis {
    return this.redisService.getClient();
  }

  /*
    comprehensive function for saving new user in database
    and create/update fields for purposes
    like reset password, refresh token etc.
  */
  async setUser(id: string, properties: Map<string, string>, refreshIn: number): Promise<boolean> {
    const res: string = await this.client.hmset(id, properties);
    await this.client.expire(id, refreshIn)

    if (!res) {
      throw new Error("Can not save data in redis database.");
    }

    return true;
  }

  async getFields(id: string, keys: string[]): Promise<Record<string, string>> {
    const values: string[] = await this.client.hmget(id, keys);

    if (values.includes(null)) {
      throw new Error("Can not fetch data - property does not exist.");
    }

    return Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]));
  }

  async userExists(id: string): Promise<boolean> {
    const res = await this.client.exists(id);

    return res === 1;
  }

  async getValue(id: string, key: string): Promise<string> {
    const value = await this.client.hget(id, key);

    if (!value) {
      throw new Error(`Can not fetch ${key} property from user with id: ${id}`);
    }

    return value;
  }

  async deleteField(id: string, key: string): Promise<boolean> {
    const isRemoved = await this.client.hdel(id, key);

    if (isRemoved !== 1) {
      throw new Error(
        `Can not delete ${key} property from user with id: ${id}`
      );
    }

    return true;
  }

  async deleteUser(id: string): Promise<boolean> {
    const isRemoved = await this.client.del(id);

    if (isRemoved !== 1) {
      throw new Error(`Can not delete user with id: ${id}`);
    }

    return true;
  }
}