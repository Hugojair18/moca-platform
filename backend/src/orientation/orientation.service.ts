import { Injectable } from '@nestjs/common';
import { OrientationSubmissionDTO, OrientationResultDTO } from '@moca/shared';

@Injectable()
export class OrientationService {
    evaluate(submission: OrientationSubmissionDTO): OrientationResultDTO {
        const { date, place, city } = submission.data;

        let dateScore = 0;
        const now = new Date();

        // Date Scoring (1 point each part)
        // Day of month: Strict match? or +/- 1? Strict for MoCA usually.
        if (date.day === now.getDate()) dateScore++;

        // Month: 0-indexed in JS
        if (date.month === now.getMonth() + 1) dateScore++;

        // Year
        if (date.year === now.getFullYear()) dateScore++;

        // Day of Week: 0=Sun, 1=Mon... submitted likely string?
        // Let's assume frontend sends localized string or standardized? 
        // User sends string. We can try to match locale names. 
        // Or simpler: frontend sends index? No, shared type says string.
        // Let's rely on basic locale match or exact match.
        // For simplicity in this demo: we will get day index from system
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const currentDow = days[now.getDay()];
        if (date.dayOfWeek.toLowerCase() === currentDow.toLowerCase()) dateScore++;

        // Place and City (Manual)
        const placeScore = place.isCorrect ? 1 : 0;
        const cityScore = city.isCorrect ? 1 : 0;

        return {
            score: dateScore + placeScore + cityScore,
            maxScore: 6,
            details: {
                dateScore,
                placeScore,
                cityScore
            }
        };
    }
}
