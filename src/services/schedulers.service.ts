import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { PersistService } from "./persist.service";
import { Message } from "../models/messageModel";
import { MetricsEvent } from "../metrics/monitor";

let processedMessages = 0;

@Injectable()
export class SchedulersService {
  private readonly logger = new Logger(SchedulersService.name);

  constructor(private readonly persistService: PersistService) {}

  @Interval(1000)
  async reportStats() {
    process.send({
      type: MetricsEvent.MESSAGES_PER_SEC,
      value: processedMessages,
    });
    processedMessages = 0;
  }

  @Interval(1000)
  async handleProcessing() {
    const elements = await this.persistService.get();
    for (const element of elements) {
      const message: Message = <Message>JSON.parse(element);
      const date = new Date(parseInt(message.timestamp)).toISOString();
      const removedStatus = await this.persistService.delete(element);

      if (removedStatus) {
        this.logger.debug(
          `Processing message: '${message.content}', Originally scheduled at: ${date}`
        );
        processedMessages++;
      }
    }
  }
}
