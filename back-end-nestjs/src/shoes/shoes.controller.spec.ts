import { Test, TestingModule } from '@nestjs/testing';
import { ShoesController } from './shoes.controller';
import { ShoesService } from './shoes.service';

describe('ShoesController', () => {
  let controller: ShoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoesController],
      providers: [ShoesService],
    }).compile();

    controller = module.get<ShoesController>(ShoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
