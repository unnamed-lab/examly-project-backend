import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';

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
        questions: {
          create: createExamDto.questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
          })),
        },
      },
      include: {
        questions: true,
      },
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

  async getStudentExams(userId: number) {
    return this.prisma.examEnrollment.findMany({
      where: { userId },
      include: {
        exam: true,
      },
    });
  }
}
