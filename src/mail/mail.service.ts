import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendExamResult(
    email: string,
    examTitle: string,
    score: number,
    total: number,
  ) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: `Your Exam Result: ${examTitle}`,
      html: `
        <h1>Exam Results</h1>
        <p>You have completed the exam: <strong>${examTitle}</strong></p>
        <p>Your score: <strong>${score} out of ${total}</strong></p>
        <p>Percentage: <strong>${Math.round((score / total) * 100)}%</strong></p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
