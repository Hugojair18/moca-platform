import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { VisuospatialSubmissionDTO, VisuospatialEvalResultDTO, VisuospatialTaskId } from '@moca/shared';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VisuospatialService {
    private openai: OpenAI;
    private submissions: Map<string, VisuospatialSubmissionDTO> = new Map();

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
            console.warn('OPENAI_API_KEY not set. Evaluation will fail.');
        }
        this.openai = new OpenAI({ apiKey });
    }

    async saveSubmission(submission: VisuospatialSubmissionDTO): Promise<{ submissionId: string }> {
        const id = uuidv4();
        // In a real app, save to DB
        this.submissions.set(id, submission);
        return { submissionId: id };
    }

    async evaluateSubmission(submissionId: string): Promise<VisuospatialEvalResultDTO> {
        const submission = this.submissions.get(submissionId);
        if (!submission) {
            throw new NotFoundException(`Submission ${submissionId} not found`);
        }

        const systemPrompt = this.getSystemPrompt(submission.taskId);

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `Tarea: ${submission.taskId}` },
                            {
                                type: "image_url",
                                image_url: {
                                    url: submission.imageBase64,
                                }
                            }
                        ]
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 500,
            });

            const content = response.choices[0].message.content;
            if (!content) throw new InternalServerErrorException("Empty response from OpenAI");

            const result = JSON.parse(content) as VisuospatialEvalResultDTO;
            return result;

        } catch (error) {
            console.error("OpenAI Evaluation Error:", error);
            throw new InternalServerErrorException("Failed to evaluate submission");
        }
    }

    private getSystemPrompt(taskId: VisuospatialTaskId): string {
        const BASE_INSTRUCTIONS = `
            Rol: Evaluador MoCA (visuoespacial), modo estricto.
            Reglas:
            - Ante duda → NO otorgar punto.
            - Si no puedes verificar un criterio con claridad → pass=false y describe brevemente.
            - Garabato/abstracto/ilegible → score=0 y unscorable=false.
            - unscorable=true SOLO si la imagen está completamente en blanco o completamente negra.
            Salida: SOLO JSON válido, exactamente el schema indicado. Notas muy breves.
            `.trim();

        switch (taskId) {
            case "A_TRAIL":
                return `
            ${BASE_INSTRUCTIONS}

            TAREA: Trail Making (Alternancia).
            Objetivo: Conectar EXACTAMENTE 1-A-2-B-3-C-4-D-5-E.

            CRITERIOS [A_TRAIL] (max 1):
            - Score=1 SOLO si la secuencia es perfecta y no hay cruces incorrectos.
            - Cualquier error de orden, omisión, desconexión o cruce incorrecto → score=0.

            OUTPUT SCHEMA (estricto):
            {
            "taskId": "A_TRAIL",
            "unscorable": boolean,
            "score": number,
            "maxScore": 1,
            "confidence": number,
            "checks": {
                "sequenceCorrect": { "pass": boolean, "notes": string }
            },
            "overallNotes": string
            }
            `.trim();

            case "B_CUBE":
                return `
            ${BASE_INSTRUCTIONS}

            TAREA: Copia de Cubo.

            CRITERIOS [B_CUBE] (max 1) — TOLERANCIA CLÍNICA CONTROLADA:
            - Debe existir INTENTO CLARO de cubo tridimensional.
            - Deben identificarse al menos 3 caras conectadas formando volumen.
            - Se permiten distorsiones leves de proporción/paralelismo SI el volumen es reconocible.
            - Score=0 si:
            - Es figura plana (cuadrado/rectángulo sin profundidad),
            - Líneas caóticas/abstractas,
            - Líneas extra que alteren la estructura,
            - Vértices abiertos/desconectados que impidan identificar volumen.

            OUTPUT SCHEMA (estricto):
            {
            "taskId": "B_CUBE",
            "unscorable": boolean,
            "score": number,
            "maxScore": 1,
            "confidence": number,
            "checks": {
                "cube3D": { "pass": boolean, "notes": string },
                "cubeLines": { "pass": boolean, "notes": string },
                "cubeParallelism": { "pass": boolean, "notes": string }
            },
            "overallNotes": string
            }
            `.trim();

            case "C_CLOCK":
                return `
            ${BASE_INSTRUCTIONS}

            TAREA: Dibujo de Reloj.

            VERIFICACIÓN DE OBJETO:
            - Si el dibujo NO corresponde a un reloj (p.ej., corazón/cara/espiral/objeto distinto) → score=0 y unscorable=false.
            - unscorable=true SOLO si la imagen está completamente en blanco o negra.

            CRITERIOS [C_CLOCK] (max 3; 1 punto cada uno):
            1) Contour (1): Círculo cerrado aceptable. Si está abierto → 0 en contour.
            2) Numbers (1): 1–12 presentes, legibles, en orden y dentro del contorno.
            - Si faltan, están fuera, ilegibles, o el orden es incorrecto → 0 en numbers.
            3) Hands (1): Marcan 11:10 aprox.
            - Minutero hacia 2; horario hacia 11 (o entre 11–12),
            - Dos manecillas, unidas al centro,
            - Horario más corto que minutero.
            - Si no se distinguen o marcan otra hora → 0 en hands.

            OUTPUT SCHEMA (estricto):
            {
            "taskId": "C_CLOCK",
            "unscorable": boolean,
            "score": number,
            "maxScore": 3,
            "confidence": number,
            "checks": {
                "contour": { "pass": boolean, "notes": string },
                "numbers": { "pass": boolean, "notes": string },
                "hands": { "pass": boolean, "notes": string }
            },
            "overallNotes": string
            }
            `.trim();

            default:
                // Por seguridad: si llega un taskId no soportado, fuerza salida consistente.
                return `
            ${BASE_INSTRUCTIONS}
            TAREA: Desconocida. Devuelve score=0, unscorable=false y explica brevemente "taskId no soportado".
            OUTPUT SCHEMA:
            {
            "taskId": "string",
            "unscorable": boolean,
            "score": number,
            "maxScore": number,
            "confidence": number,
            "checks": {},
            "overallNotes": string
            }
            `.trim();
        }
    }
}

