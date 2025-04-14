import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ enum: ['MULTIPLE_CHOICE', 'ESSAY'] })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  options?: string[];

  @ApiProperty({ required: false })
  correctAnswer?: string;

  @ApiProperty()
  @IsNumber()
  points: number;
}

export class CreateExamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  courseCode: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ type: [QuestionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[] | null;
}
