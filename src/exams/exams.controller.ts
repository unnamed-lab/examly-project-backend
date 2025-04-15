import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateExamDto, QuestionDto } from './dto/create-exam.dto';
import { CustomRequest } from 'types';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  createExam(@Body() createExamDto: CreateExamDto) {
    return this.examsService.createExam(createExamDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update new exam' })
  @ApiResponse({ status: 201, description: 'Exam updated successfully' })
  updateExam(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.updateExam(+id, updateExamDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'List of exams' })
  getExams() {
    return this.examsService.getExams();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  getExamById(@Param('id') id: string) {
    return this.examsService.getExamById(+id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete exam by ID' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  deleteExamById(@Param('id') id: string) {
    return this.examsService.deleteExamById(+id);
  }

  @Get(':id/questions')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exam questions' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  getQuestions(@Param('id') id: string) {
    return this.examsService.getAllQuestion(+id);
  }

  @Post(':id/question')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create exam question' })
  @ApiResponse({ status: 200, description: 'Question details' })
  addQuestion(@Param('id') id: string, @Body() createQuestionDto: QuestionDto) {
    return this.examsService.addQuestion(+id, createQuestionDto);
  }

  @Get('question/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  getQuestionById(@Param('id') id: string) {
    return this.examsService.getQuestion(+id);
  }

  @Patch('question/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update exam question' })
  @ApiResponse({ status: 200, description: 'Question details' })
  updateQuestion(
    @Param('id') id: string,
    @Body() createQuestionDto: QuestionDto,
  ) {
    return this.examsService.updateQuestion(+id, createQuestionDto);
  }

  @Delete('question/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete question by ID' })
  @ApiResponse({ status: 200, description: 'Question details' })
  deleteQuestionById(@Param('id') id: string) {
    return this.examsService.deleteQuestion(+id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in an exam' })
  @ApiResponse({ status: 201, description: 'Enrollment successful' })
  enrollInExam(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.examsService.enrollUser(+id, req.user?.userId);
  }

  @Get('student/my-exams')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student exams' })
  @ApiResponse({ status: 200, description: 'List of student exams' })
  getStudentExams(@Req() req: CustomRequest) {
    return this.examsService.getStudentExams(req.user?.userId);
  }
}
