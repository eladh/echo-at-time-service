import { Injectable } from "@nestjs/common";
import {
  Message,
  SubmittedMessage,
  SubmittedMessageResponse,
} from "../models/messageModel";
import { PersistService } from "./persist.service";

@Injectable()
export class MessageService {
  constructor(private readonly persistService: PersistService) {}

  async submit(messageModel: Message): Promise<SubmittedMessageResponse> {
    const submitMessage: SubmittedMessage = await this.persistService.add(
      messageModel
    );

    return {
      message: messageModel,
      scheduleAt: new Date(parseInt(messageModel.timestamp)).toISOString(),
      status: submitMessage.status,
    };
  }
}
