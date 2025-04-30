/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private mailer: MailerService,
  ) {}

  async sendExamResult(
    email: string,
    examTitle: string,
    score: number,
    total: number,
  ) {
    const from = this.configService.get<string>('MAIL_FROM_ADDRESS');
    const sender = this.configService.get<string>('MAIL_FROM_NAME');

    const mailOptions = {
      from,
      to: email,
      sender,
      subject: `Your Exam Result: ${examTitle}`,
      html: `
        <h1>Exam Results</h1>
        <p>You have completed the exam: <strong>${examTitle}</strong></p>
        <p>Your score: <strong>${score} out of ${total}</strong></p>
        <p>Percentage: <strong>${Math.round((score / total) * 100)}%</strong></p>
      `,
    };

    try {
      await this.mailer.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
}
