
export type Role = "ADMIN" | "USER" | "PROFESSIONAL" | "PATIENT";

export type SessionStatus =
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "FINALIZED";

export type QuestionType =
    | "TEXT"
    | "SEQUENCE"
    | "NUMBER_INPUT"
    | "TAP_WHEN_HEAR"
    | "TIMER_WORDS"
    | "CANVAS_DRAW";

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

// Visuospatial Types
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
    detectedObject?: string;
    isTargetObject?: boolean;
    checks: Record<string, { pass: boolean; notes: string } | null>;
    overallNotes: string;
}

// Identification (Naming) Types
export type IdentificationTaskId = "NAMING_LION" | "NAMING_RHINO" | "NAMING_CAMEL";

export interface IdentificationSubmissionDTO {
    testId: string;
    answers: Record<IdentificationTaskId, string>; // { NAMING_LION: "león", ... }
    metadata: {
        timestamp: number;
    };
}

export interface IdentificationResultDTO {
    totalScore: number; // 0 to 3
    results: Record<IdentificationTaskId, {
        correct: boolean;
        userAnswer: string;
    }>;
}
