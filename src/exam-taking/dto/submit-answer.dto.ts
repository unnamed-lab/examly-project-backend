import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsString()
  response: string;
}
