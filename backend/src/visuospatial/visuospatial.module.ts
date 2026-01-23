import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VisuospatialService } from './visuospatial.service';
import { VisuospatialController } from './visuospatial.controller';

@Module({
  imports: [ConfigModule],
  controllers: [VisuospatialController],
  providers: [VisuospatialService],
})
export class VisuospatialModule { }
