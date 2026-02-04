import { Controller, Post, Body } from '@nestjs/common';
import { AbstractionService } from './abstraction.service';
import type { AbstractionSubmissionDTO } from '@moca/shared';

@Controller('abstraction')
export class AbstractionController {
    constructor(private readonly abstractionService: AbstractionService) { }

    @Post('submit')
    async submit(@Body() submission: AbstractionSubmissionDTO) {
        return this.abstractionService.evaluate(submission);
    }
}
