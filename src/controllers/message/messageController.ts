import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { MessageService } from "../../services/message.service";
import { Message, SubmittedMessageResponse } from "../../models/messageModel";

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post("echoAtTime")
  @HttpCode(201)
  async echoAtTime(
    @Body() message: Message
  ): Promise<SubmittedMessageResponse> {
    if (
      isEmpty(message.content) ||
      isEmpty(message.timestamp) ||
      new Date(message.timestamp).getTime() <= 0
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Request not valid",
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.messageService.submit(message);
  }
}

const isEmpty = (value) => value === null;
