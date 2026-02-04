import { Injectable } from '@nestjs/common';
import { DelayedRecallSubmissionDTO, DelayedRecallResultDTO, MemoryWord } from '@moca/shared';

@Injectable()
export class DelayedRecallService {
    // The target words from the Memory module
    private readonly TARGET_WORDS: string[] = ['ROSTRO', 'SEDA', 'IGLESIA', 'CLAVEL', 'ROJO'];

    evaluate(submission: DelayedRecallSubmissionDTO): DelayedRecallResultDTO {
        const userWords = submission.data.words.map(w => w.toUpperCase().trim());
        const spontaneousMatches: string[] = [];
        const missedWords: string[] = [];

        // Check Spontaneous Recall
        this.TARGET_WORDS.forEach(target => {
            // Simple inclusion check. In a real app, we might use cosine similarity or stemming.
            // But strict MoCA usually requires the exact word.
            if (userWords.includes(target)) {
                spontaneousMatches.push(target);
            } else {
                missedWords.push(target);
            }
        });

        // Calculate Score (only spontaneous counts for the main score)
        const score = spontaneousMatches.length;

        return {
            score,
            maxScore: 5,
            details: {
                spontaneous: spontaneousMatches,
                cued: [], // Populated if we were handling cued recall submission specifically here
                choice: [],
                missed: missedWords
            }
        };
    }
}
