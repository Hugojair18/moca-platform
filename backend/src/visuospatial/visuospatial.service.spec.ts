import { Test, TestingModule } from '@nestjs/testing';
import { VisuospatialService } from './visuospatial.service';

describe('VisuospatialService', () => {
  let service: VisuospatialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisuospatialService],
    }).compile();

    service = module.get<VisuospatialService>(VisuospatialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
