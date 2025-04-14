import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartExamDto {
  @ApiProperty()
  @IsNumber()
  enrollmentId: number;
}
