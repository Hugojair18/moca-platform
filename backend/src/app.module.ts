import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisuospatialModule } from './visuospatial/visuospatial.module';
import { AbstractionModule } from './abstraction/abstraction.module';
import { DelayedRecallModule } from './delayed-recall/delayed-recall.module';
import { OrientationModule } from './orientation/orientation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VisuospatialModule,
    AbstractionModule,
    DelayedRecallModule,
    OrientationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
