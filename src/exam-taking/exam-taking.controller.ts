import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ExamTakingService } from './exam-taking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomRequest } from 'types';
import { StartExamDto } from './dto/start-exam.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@ApiTags('Exam Taking')
@Controller('exam-taking')
export class ExamTakingController {
  constructor(private readonly examTakingService: ExamTakingService) {}

  @Post('start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start an exam' })
  @ApiResponse({ status: 200, description: 'Exam started successfully' })
  startExam(@Body() startExamDto: StartExamDto, @Req() req: CustomRequest) {
    if (!req.user) throw new NotFoundException('User not found');

    return this.examTakingService.startExam(
      startExamDto.enrollmentId,
      req.user.userId,
    );
  }

  @Post('submit-answer/:enrollmentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit an answer' })
  @ApiResponse({ status: 200, description: 'Answer submitted successfully' })
  submitAnswer(
    @Param('enrollmentId') enrollmentId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
    @Req() req: CustomRequest,
  ) {
    if (!req.user) throw new NotFoundException('User not found');

    return this.examTakingService.submitAnswer(
      +enrollmentId,
      req.user.userId,
      submitAnswerDto,
    );
  }

  @Post('complete/:enrollmentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete an exam' })
  @ApiResponse({ status: 200, description: 'Exam completed successfully' })
  completeExam(
    @Param('enrollmentId') enrollmentId: string,
    @Req() req: CustomRequest,
  ) {
    if (!req.user) throw new NotFoundException('User not found');

    return this.examTakingService.completeExam(+enrollmentId, req.user.userId);
  }

  @Get('status/:enrollmentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exam status and remaining time' })
  @ApiResponse({ status: 200, description: 'Exam status' })
  getExamStatus(
    @Param('enrollmentId') enrollmentId: string,
    @Req() req: CustomRequest,
  ) {
    if (!req.user) throw new NotFoundException('User not found');

    return this.examTakingService.getExamStatus(+enrollmentId, req.user.userId);
  }
}
