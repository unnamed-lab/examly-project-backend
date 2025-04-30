import { MailService } from './../mail/mail.service';
import { Module } from '@nestjs/common';
import { ExamTakingService } from './exam-taking.service';
import { ExamTakingController } from './exam-taking.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ExamTakingService, PrismaService, JwtService, MailService],
  controllers: [ExamTakingController],
})
export class ExamTakingModule {}
