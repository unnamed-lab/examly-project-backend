import { Test, TestingModule } from '@nestjs/testing';
import { ExamTakingController } from './exam-taking.controller';

describe('ExamTakingController', () => {
  let controller: ExamTakingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamTakingController],
    }).compile();

    controller = module.get<ExamTakingController>(ExamTakingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
