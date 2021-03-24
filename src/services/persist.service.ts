import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "nestjs-redis";
import * as Redis from "ioredis";
import { nanoid } from "nanoid";
import { Message, SubmittedMessage } from "../models/messageModel";
import { RedisLockUtil } from "../utils/redis-lock-util.service";

const storeKeyId: string = process.env.STORE_KEY_ID || "messages";

@Injectable()
export class PersistService {
  private readonly client: Redis.Redis = this.redisService.getClient("default");
  private lastTimeStamp = 0;

  private readonly logger = new Logger(PersistService.name);

  constructor(private readonly redisService: RedisService) {
    this.client.on("connect", () => {
      this.logger.log("redis client connected successfully");
    });

    this.client.on("error", (error) => {
      this.logger.error(error);
      process.exit(0);
    });
  }

  async add(messageModel: Message): Promise<SubmittedMessage> {
    messageModel.id = nanoid();

    const statusCode: any = await this.client.zadd(
      storeKeyId,
      messageModel.timestamp,
      JSON.stringify(messageModel)
    );

    return { id: messageModel.id, status: statusCode };
  }

  async get(): Promise<string[]> {
    const messages = await this.client.zrangebyscore(
      storeKeyId,
      this.lastTimeStamp,
      Date.now() + 1000
    );
    if (messages.length === 0) {
      return messages;
    }
    const lastMessage = <Message>JSON.parse(messages[messages.length - 1]);
    this.lastTimeStamp = Number(lastMessage.timestamp);

    return messages;
  }

  async delete(message: string): Promise<number> {
    let id = null;
    try {
      id = await RedisLockUtil.acquireLock(this.client, message);
      return await this.client.zrem(storeKeyId, message);
    } finally {
      await RedisLockUtil.releaseLock(this.client, message, id);
    }
  }
}
