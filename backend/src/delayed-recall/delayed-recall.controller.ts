import { Controller, Post, Body } from '@nestjs/common';
import { DelayedRecallService } from './delayed-recall.service';
import type { DelayedRecallSubmissionDTO } from '@moca/shared';

@Controller('delayed-recall')
export class DelayedRecallController {
    constructor(private readonly service: DelayedRecallService) { }

    @Post('submit')
    submit(@Body() submission: DelayedRecallSubmissionDTO) {
        return this.service.evaluate(submission);
    }
}
