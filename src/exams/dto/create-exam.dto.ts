import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QuestionDto {
  @ApiProperty({ type: String })
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
  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @ApiProperty({ type: String })
  @IsNumber()
  @IsOptional()
  points: number;
}

export class CreateExamDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  courseCode: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ type: [QuestionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];
}
