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
    detectedObject?: string;
    isTargetObject?: boolean;
    checks: Record<string, {
        pass: boolean;
        notes: string;
    } | null>;
    overallNotes: string;
}
export type IdentificationTaskId = "NAMING_LION" | "NAMING_RHINO" | "NAMING_CAMEL";
export interface IdentificationSubmissionDTO {
    testId: string;
    answers: Record<IdentificationTaskId, string>;
    metadata: {
        timestamp: number;
    };
}
export interface IdentificationResultDTO {
    totalScore: number;
    results: Record<IdentificationTaskId, {
        correct: boolean;
        userAnswer: string;
    }>;
}
export type MemoryWord = "ROSTRO" | "SEDA" | "IGLESIA" | "CLAVEL" | "ROJO";
export interface MemorySubmissionDTO {
    testId: string;
    trial1: MemoryWord[];
    trial2: MemoryWord[];
    metadata: {
        timestamp: number;
    };
}
export type AttentionTaskId = "DIGITS_FORWARD" | "DIGITS_BACKWARD" | "LETTERS" | "SUBTRACTION_7";
export interface AttentionSubmissionDTO {
    testId: string;
    taskId: AttentionTaskId;
    data: {
        sequence?: string[];
        errorCount?: number;
    };
    metadata: {
        timestamp: number;
    };
}
export interface AttentionResultDTO {
    taskId: AttentionTaskId;
    score: number;
    maxScore: number;
    notes?: string;
}
export type LanguageTaskId = "REPEAT_SENTENCE_1" | "REPEAT_SENTENCE_2" | "FLUENCY_P";
export interface LanguageSubmissionDTO {
    testId: string;
    taskId: LanguageTaskId;
    data: {
        transcript?: string;
        wordCount?: number;
    };
    metadata: {
        timestamp: number;
    };
}
export interface LanguageResultDTO {
    taskId: LanguageTaskId;
    score: number;
    maxScore: number;
    notes?: string;
}
export type AbstractionTaskId = "ABSTRACTION_PRACTICE" | "ABSTRACTION_TRAIN" | "ABSTRACTION_WATCH";
export interface AbstractionSubmissionDTO {
    testId: string;
    taskId: AbstractionTaskId;
    data: {
        response: string;
    };
    metadata: {
        timestamp: number;
    };
}
export type DelayedRecallTaskId = "RECALL_SPONTANEOUS" | "RECALL_CUED" | "RECALL_CHOICE";
export interface DelayedRecallSubmissionDTO {
    testId: string;
    taskId: DelayedRecallTaskId;
    data: {
        words: string[];
        cued?: Record<string, string>;
    };
    metadata: {
        timestamp: number;
    };
}
export interface DelayedRecallResultDTO {
    score: number;
    maxScore: number;
    details: {
        spontaneous: string[];
        cued: string[];
        choice: string[];
        missed: string[];
    };
}
export type OrientationTaskId = "DATE_FULL" | "PLACE_CITY";
export interface OrientationSubmissionDTO {
    testId: string;
    taskId: OrientationTaskId;
    data: {
        date: {
            day: number;
            month: number;
            year: number;
            dayOfWeek: string;
        };
        place: {
            value: string;
            isCorrect: boolean;
        };
        city: {
            value: string;
            isCorrect: boolean;
        };
    };
    metadata: {
        timestamp: number;
    };
}
export interface OrientationResultDTO {
    score: number;
    maxScore: number;
    details: {
        dateScore: number;
        placeScore: number;
        cityScore: number;
    };
}
