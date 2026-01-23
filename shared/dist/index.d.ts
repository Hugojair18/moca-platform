export type Role = "ADMIN" | "USER" | "PROFESSIONAL" | "PATIENT";
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
export type VisuospatialTaskId = "A_TRAIL" | "B_CUBE" | "C_CLOCK";
export interface VisuospatialSubmissionDTO {
    testId: string;
    taskId: VisuospatialTaskId;
    imageBase64: string;
    metadata: {
        timestamp: number;
        deviceType?: string;
    };
}
export interface VisuospatialEvalResultDTO {
    taskId: VisuospatialTaskId;
    unscorable: boolean;
    score: number;
    maxScore: number;
    confidence: number;
    checks: Record<string, {
        pass: boolean;
        notes: string;
    } | null>;
    overallNotes: string;
}
