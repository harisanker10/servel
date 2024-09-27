import { Test, TestingModule } from '@nestjs/testing';
import { BuildController } from './build.controller';
import { BuildService } from './build.service';

describe('BuildController', () => {
  let controller: BuildController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildController],
      providers: [BuildService],
    }).compile();

    controller = module.get<BuildController>(BuildController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
