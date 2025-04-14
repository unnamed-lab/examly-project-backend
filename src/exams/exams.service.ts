import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto, QuestionDto } from './dto/create-exam.dto';
import { UpdateExamDto, UpdateQuestionDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async createExam(createExamDto: CreateExamDto) {
    return this.prisma.exam.create({
      data: {
        title: createExamDto.title,
        courseCode: createExamDto.courseCode,
        description: createExamDto.description,
        duration: createExamDto.duration,
        ...(createExamDto.questions && {
          questions: {
            create: createExamDto.questions.map((q) => ({
              text: q.text,
              type: q.type,
              options: q.options,
              correctAnswer: q.correctAnswer,
              points: q.points || 1, // Default points if not provided
            })),
          },
        }),
      },
      include: {
        questions: true,
      },
    });
  }

  async updateExam(id: number, updateExamDto: UpdateExamDto) {
    return this.prisma.exam.update({
      where: { id },
      data: {
        title: updateExamDto.title,
        courseCode: updateExamDto.courseCode,
        description: updateExamDto.description,
        duration: updateExamDto.duration,
        ...(updateExamDto.questions && {
          questions: {
            create: updateExamDto.questions.map((q) => ({
              text: q.text,
              type: q.type,
              options: q.options,
              correctAnswer: q.correctAnswer,
              points: q.points || 1, // Default points if not provided
            })),
          },
        }),
      },
      include: {
        questions: true,
      },
    });
  }

  /**
   * Add question
   * @param id Exam Id
   * @param createQuestionDto
   * @returns
   */
  async addQuestion(id: number, createQuestionDto: QuestionDto) {
    return this.prisma.question.create({
      data: {
        examId: id,
        type: createQuestionDto.type,
        text: createQuestionDto.text,
        points: createQuestionDto.points,
        correctAnswer: createQuestionDto.correctAnswer,
        options: createQuestionDto.options,
      },
    });
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data: {
        examId: id,
        type: updateQuestionDto.type,
        text: updateQuestionDto.text,
        points: updateQuestionDto.points,
        correctAnswer: updateQuestionDto.correctAnswer,
        options: updateQuestionDto.options,
      },
    });
  }

  async getQuestion(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) throw new NotFoundException();

    return question;
  }

  async getAllQuestion(id: number) {
    return this.prisma.question.findMany({
      where: { examId: id },
    });
  }

  async deleteQuestion(id: number) {
    return this.prisma.question.delete({
      where: { id },
    });
  }

  async getExams() {
    return this.prisma.exam.findMany({
      include: {
        questions: true,
      },
    });
  }

  async getExamById(id: number) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });
  }

  async enrollUser(examId: number, userId: number) {
    return this.prisma.examEnrollment.create({
      data: {
        examId,
        userId,
      },
    });
  }

  async getStudentExams(userId: number, questionCount = 30) {
    const enrollments = await this.prisma.examEnrollment.findMany({
      where: { userId },
      include: {
        exam: {
          include: {
            questions: true,
          },
        },
      },
    });

    return enrollments.map((enrollment) => ({
      ...enrollment,
      exam: {
        ...enrollment.exam,
        questions: enrollment.exam.questions
          ? [...enrollment.exam.questions]
              .sort(() => 0.5 - Math.random())
              .slice(0, questionCount)
          : [],
      },
    }));
  }

  async deleteExamById(id: number) {
    return this.prisma.exam.delete({
      where: { id },
      include: {
        questions: true,
      },
    });
  }
}
