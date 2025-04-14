/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateTime } from 'luxon';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class ExamTakingService {
  constructor(private prisma: PrismaService) {}

  async startExam(enrollmentId: number, userId: number) {
    const enrollment = await this.prisma.examEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { exam: true },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('You are not enrolled in this exam');
    }

    if (enrollment.startTime) {
      throw new ForbiddenException('Exam already started');
    }

    const now = DateTime.now().toJSDate();
    const endTime = DateTime.now()
      .plus({ minutes: enrollment.exam.duration })
      .toJSDate();

    return this.prisma.examEnrollment.update({
      where: { id: enrollmentId },
      data: {
        startTime: now,
        endTime,
      },
      include: {
        exam: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  async submitAnswer(
    enrollmentId: number,
    userId: number,
    submitAnswerDto: SubmitAnswerDto,
  ) {
    const enrollment = await this.prisma.examEnrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('You are not enrolled in this exam');
    }

    if (!enrollment.startTime) {
      throw new ForbiddenException('Exam not started');
    }

    if (enrollment.completed) {
      throw new ForbiddenException('Exam already completed');
    }

    const question = await this.prisma.question.findUnique({
      where: { id: submitAnswerDto.questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    let isCorrect = false;
    if (question.type === 'MULTIPLE_CHOICE') {
      isCorrect = question.correctAnswer === submitAnswerDto.response;
    }

    return this.prisma.answer.create({
      data: {
        enrollmentId,
        questionId: submitAnswerDto.questionId,
        response: submitAnswerDto.response,
        isCorrect,
      },
    });
  }

  async completeExam(enrollmentId: number, userId: number) {
    const enrollment = await this.prisma.examEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('You are not enrolled in this exam');
    }

    if (!enrollment.startTime) {
      throw new ForbiddenException('Exam not started');
    }

    if (enrollment.completed) {
      throw new ForbiddenException('Exam already completed');
    }

    // Calculate score
    const score = enrollment.answers.reduce((total, answer) => {
      return total + (answer.isCorrect ? answer.question.points : 0);
    }, 0);

    return this.prisma.examEnrollment.update({
      where: { id: enrollmentId },
      data: {
        completed: true,
        score,
      },
    });
  }

  async getExamStatus(enrollmentId: number, userId: number) {
    const enrollment = await this.prisma.examEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        exam: true,
        answers: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('You are not enrolled in this exam');
    }

    const now = DateTime.now();
    const endTime = DateTime.fromJSDate(enrollment.endTime);
    const remainingTime = endTime.diff(now, 'seconds').seconds;

    return {
      enrollment,
      remainingTime: Math.max(0, Math.floor(remainingTime)),
      isTimeUp: remainingTime <= 0,
    };
  }
}
