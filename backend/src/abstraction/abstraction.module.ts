import { Module } from '@nestjs/common';
import { AbstractionController } from './abstraction.controller';
import { AbstractionService } from './abstraction.service';

@Module({
    controllers: [AbstractionController],
    providers: [AbstractionService],
})
export class AbstractionModule { }
