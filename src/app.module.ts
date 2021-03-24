import { Module } from "@nestjs/common";
import { RedisModule } from "nestjs-redis";
import { ScheduleModule } from "@nestjs/schedule";

import { RedisModuleOptions } from "nestjs-redis/dist/redis.interface";
import { TerminusModule } from "@nestjs/terminus";
import { MessageController } from "./controllers/message/messageController";
import { SchedulersService } from "./services/schedulers.service";
import { PersistService } from "./services/persist.service";
import { MessageService } from "./services/message.service";
import { HealthController } from "./controllers/health/health.controller";

const redisConfig: RedisModuleOptions = {
  name: "default",
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

@Module({
  imports: [
    RedisModule.register(redisConfig),
    ScheduleModule.forRoot(),
    TerminusModule,
  ],
  controllers: [MessageController, HealthController],
  providers: [SchedulersService, PersistService, MessageService],
})
export class AppModule {}
