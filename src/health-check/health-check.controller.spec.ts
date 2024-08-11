import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './health-check.controller';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    controller = module.get<HealthCheckController>(HealthCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the current timestamp', () => {
    let result, error;

    try {
      result = controller.healthCheck();
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(result).toBeDefined();
    }
  });
});
