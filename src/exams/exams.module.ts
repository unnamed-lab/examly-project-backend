import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';

@Module({
  providers: [ExamsService],
  controllers: [ExamsController],
})
export class ExamsModule {}
