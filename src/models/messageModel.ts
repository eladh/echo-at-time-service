import { ApiProperty } from "@nestjs/swagger";

export class Message {
  @ApiProperty()
  content: string;

  @ApiProperty()
  timestamp: string;

  id?: string;
}

export interface SubmittedMessageResponse {
  message: Message;
  scheduleAt: string;
  status: boolean;
}

export interface SubmittedMessage {
  id: string;
  status: boolean;
}
