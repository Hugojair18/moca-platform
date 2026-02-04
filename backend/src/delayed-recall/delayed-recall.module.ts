import { Module } from '@nestjs/common';
import { DelayedRecallController } from './delayed-recall.controller';
import { DelayedRecallService } from './delayed-recall.service';

@Module({
    controllers: [DelayedRecallController],
    providers: [DelayedRecallService],
})
export class DelayedRecallModule { }
