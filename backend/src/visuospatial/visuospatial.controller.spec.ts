import { Test, TestingModule } from '@nestjs/testing';
import { VisuospatialController } from './visuospatial.controller';

describe('VisuospatialController', () => {
  let controller: VisuospatialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisuospatialController],
    }).compile();

    controller = module.get<VisuospatialController>(VisuospatialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
