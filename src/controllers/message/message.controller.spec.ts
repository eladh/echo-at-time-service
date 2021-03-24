import { Test, TestingModule } from "@nestjs/testing";
import { RedisModule, RedisService } from "nestjs-redis";
import { RedisModuleOptions } from "nestjs-redis/dist/redis.interface";
import { MessageController } from "./messageController";
import { MessageService } from "../../services/message.service";
import { Message } from "../../models/messageModel";
import { PersistService } from "../../services/persist.service";

const demoMessage: Message = { content: "msg", timestamp: "1616079653" };

const redisConfig: RedisModuleOptions = {
  name: "default",
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

describe("AppController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [RedisModule.register(redisConfig)],
      controllers: [MessageController],
      providers: [MessageService, PersistService, RedisService],
    }).compile();
  });

  describe("echoAtTime", () => {
    it("should return operation submitted", () => {
      const msgController = app.get<MessageController>(MessageController);
      expect(msgController.echoAtTime(demoMessage)).toBe(
        `Submitted-${demoMessage.timestamp}`
      );
    });
  });
});
