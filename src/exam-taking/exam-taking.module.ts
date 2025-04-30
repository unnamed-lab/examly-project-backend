import { MailService } from './../mail/mail.service';
import { Module } from '@nestjs/common';
import { ExamTakingService } from './exam-taking.service';
import { ExamTakingController } from './exam-taking.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          pool: true,
          host: config.get<string>('MAIL_HOST'),
          port: parseInt(config.get<string>('MAIL_PORT'), 10),
          secure: config.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get<string>('MAIL_FROM_NAME')}" <${config.get('MAIL_FROM_ADDRESS')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [ExamTakingService, PrismaService, JwtService, MailService],
  controllers: [ExamTakingController],
})
export class ExamTakingModule {}
