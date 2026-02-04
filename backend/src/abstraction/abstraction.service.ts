import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AbstractionSubmissionDTO, AbstractionTaskId } from '@moca/shared';

@Injectable()
export class AbstractionService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({ apiKey: this.configService.get<string>('OPENAI_API_KEY') });
    }

    async evaluate(submission: AbstractionSubmissionDTO) {
        const { taskId, data } = submission;
        const prompt = this.getPrompt(taskId);

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: `Input: "${data.response}"` }
                ],
                response_format: { type: "json_object" },
                max_tokens: 50,
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error("Empty OpenAI response");

            return JSON.parse(content);
        } catch (error) {
            console.error("Abstraction Eval Error:", error);
            throw new InternalServerErrorException("Evaluation failed");
        }
    }

    private getPrompt(taskId: AbstractionTaskId): string {
        // Highly optimized prompt for token efficiency
        return `
Rol: MoCA Judge. STRICT. 
Task: '${taskId}'.
Criteria:
- ABSTRACTION_TRAIN (Train-Bicycle): Req "Transport"/"Vehicle"/"Travel". (Concrete e.g. "Wheels"=0).
- ABSTRACTION_WATCH (Watch-Ruler): Req "Measuring"/"Measure". (Concrete e.g. "Numbers"=0).
Output JSON: { "score": 0|1, "notes": "max 5 words" }
`.trim();
    }
}
