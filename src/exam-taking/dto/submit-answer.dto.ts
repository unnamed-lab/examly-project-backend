import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  questionId: number;

  @ApiProperty({ type: String })
  @IsString()
  response: string;
}
