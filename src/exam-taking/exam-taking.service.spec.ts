import { Test, TestingModule } from '@nestjs/testing';
import { ExamTakingService } from './exam-taking.service';

describe('ExamTakingService', () => {
  let service: ExamTakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamTakingService],
    }).compile();

    service = module.get<ExamTakingService>(ExamTakingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
