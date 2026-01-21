export type Role = "ADMIN" | "USER";
export type SessionStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "UNDER_REVIEW" | "FINALIZED";
export type QuestionType = "TEXT" | "SEQUENCE" | "NUMBER_INPUT" | "TAP_WHEN_HEAR" | "TIMER_WORDS" | "CANVAS_DRAW";
export interface MoCAQuestion {
    key: string;
    sectionId: string;
    type: QuestionType;
    title: string;
    prompt: string;
    maxScore: number;
    needsReview?: boolean;
    autoScoreRuleId?: string;
    ui?: Record<string, unknown>;
}
