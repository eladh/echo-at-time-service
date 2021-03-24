import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { MessageService } from "../services/message.service";
import { SubmittedMessageResponse } from "../models/messageModel";

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post("echoAtTime")
  @HttpCode(201)
  async echoAtTime(
    @Query("content") content: string,
    @Query("timestamp") timestamp: string
  ): Promise<SubmittedMessageResponse> {
    if (
      isEmpty(content) ||
      isEmpty(timestamp) ||
      new Date(timestamp).getTime() <= 0
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Request not valid",
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.messageService.submit({
      content,
      timestamp,
    });
  }
}

const isEmpty = (value) => value === null || value.trim() === "";
