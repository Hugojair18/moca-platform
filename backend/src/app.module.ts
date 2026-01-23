import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisuospatialModule } from './visuospatial/visuospatial.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VisuospatialModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
