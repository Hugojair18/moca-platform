import { Controller, Post, Body } from '@nestjs/common';
import { OrientationService } from './orientation.service';
import type { OrientationSubmissionDTO } from '@moca/shared';

@Controller('orientation')
export class OrientationController {
    constructor(private readonly service: OrientationService) { }

    @Post('submit')
    submit(@Body() submission: OrientationSubmissionDTO) {
        return this.service.evaluate(submission);
    }
}
