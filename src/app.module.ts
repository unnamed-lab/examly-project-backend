import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExamsModule } from './exams/exams.module';
import { ExamTakingModule } from './exam-taking/exam-taking.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import configuration from 'config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ExamsModule,
    ExamTakingModule,
    MailModule,
    PrismaModule,
    HealthModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
})
export class AppModule {}
