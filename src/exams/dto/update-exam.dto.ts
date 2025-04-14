import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDto, QuestionDto } from './create-exam.dto';

export class UpdateExamDto extends PartialType(CreateExamDto) {}

export class UpdateQuestionDto extends PartialType(QuestionDto) {}
