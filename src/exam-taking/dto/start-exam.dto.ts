import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartExamDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  enrollmentId: number;
}
