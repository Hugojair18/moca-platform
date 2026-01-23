import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CanvasPad } from '../components/ui/CanvasPad';
import type { CanvasPadRef } from '../components/ui/CanvasPad';
import type { VisuospatialTaskId } from '@moca/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STEPS: { id: VisuospatialTaskId; title: string; instruction: string; bgImage?: string; referenceImage?: string }[] = [
    {
        id: 'A_TRAIL',
        title: 'Alternancia Conceptual',
        instruction: 'Dibuje una línea alternando entre cifras y letras, respetando el orden numérico y alfabético. Comience en el 1 y termine en la E (1-A-2-B...)',
        bgImage: '/assets/trail_making_bg.png'
    },
    {
        id: 'B_CUBE',
        title: 'Copiar el Cubo',
        instruction: 'Copie el dibujo del cubo en el espacio de abajo lo más exactamente posible.',
        referenceImage: '/assets/cube_ref.png'
    },
    {
        id: 'C_CLOCK',
        title: 'Dibujar un Reloj',
        instruction: 'Dibuje un reloj circular con todos los números y las agujas marcando las 11:10.'
    }
];

export default function VisuospatialTest() {
    const { testId = 'demo-test' } = useParams(); // Default test ID for demo
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastEvalResult, setLastEvalResult] = useState<any>(null);
    const padRef = useRef<CanvasPadRef>(null);

    const currentStep = STEPS[currentStepIndex];

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setLastEvalResult(null);
            setCurrentStepIndex(prev => prev + 1);
        } else {
            // Finished Visuospatial -> Go to Naming
            navigate(`/tests/${testId}/naming`);
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setLastEvalResult(null);
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleEvaluate = async (blob: Blob | null, base64: string) => {
        if (!blob) return;
        setIsSubmitting(true);

        try {
            // 1. Submit Drawing
            const submitResponse = await axios.post(`${API_URL}/tests/${testId}/visuospatial/${currentStep.id}/submissions`, {
                imageBase64: base64,
                metadata: {
                    timestamp: Date.now(),
                    deviceType: 'web'
                }
            });

            const { submissionId } = submitResponse.data;

            // 2. Evaluate (Auto-trigger for demo purposes, normally might be separate)
            const evalResponse = await axios.post(`${API_URL}/tests/${testId}/visuospatial/${currentStep.id}/evaluate`, {
                submissionId
            });

            console.log('Evaluation Result:', evalResponse.data);
            setLastEvalResult(evalResponse.data);

            // Wait a moment then clear/proceed? Or just show next button?
            // For this flow, we'll auto-advance after showing a brief "Saved" or just advance.
            // But let's let the user manually advance or reviewing result first?

            // For now, let's just alert the score (debug) and move on
            // alert(`Evaluación AI: ${evalResponse.data.score}/${evalResponse.data.maxScore}\n${evalResponse.data.observations}`);

            // alert(`Evaluación AI: ${evalResponse.data.score}/${evalResponse.data.maxScore}\n${evalResponse.data.observations}`);

            // NOTE: We do NOT auto-advance anymore. User clicks "Continuar".


        } catch (error) {
            console.error(error);
            alert('Error al enviar. Revise la consola.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header / Progress */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Visuoespacial / Ejecutiva</h1>
                    <span className="text-sm font-medium text-slate-500">
                        Paso {currentStepIndex + 1} de {STEPS.length}
                    </span>
                </div>

                {/* Instruction Card */}
                <Card className="bg-white">
                    <h2 className="text-xl font-semibold text-brand-700 mb-2">{currentStep.title}</h2>
                    <p className="text-slate-700 text-lg">{currentStep.instruction}</p>

                    {currentStep.referenceImage && (
                        <div className="mt-6 flex justify-center">
                            <img
                                src={currentStep.referenceImage}
                                alt={`Referencia para ${currentStep.title}`}
                                className="max-w-full h-auto max-h-48 border border-slate-200 rounded p-2"
                            />
                        </div>
                    )}
                </Card>

                {/* Drawing Area */}
                <Card title="Área de Dibujo">
                    <CanvasPad
                        ref={padRef}
                        key={currentStep.id} // Re-mount on step change to clear canvas
                        onSave={handleEvaluate}
                        className="mb-4"
                        backgroundImage={currentStep.bgImage}
                    />

                    <div className="flex justify-between mt-4 border-t pt-4">
                        <Button
                            variant="secondary"
                            onClick={handlePrev}
                            disabled={currentStepIndex === 0 || isSubmitting}
                        >
                            ← Anterior
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => padRef.current?.clear()}
                                disabled={isSubmitting}
                            >
                                Borrar Trazo
                            </Button>

                            <Button
                                onClick={() => padRef.current?.save()}
                                disabled={isSubmitting}
                                className="bg-brand-600 hover:bg-brand-700 text-white"
                            >
                                {isSubmitting ? 'Evaluando...' : 'Evaluar con IA'}
                            </Button>

                            <Button
                                variant="primary"
                                onClick={handleNext}
                                disabled={isSubmitting}
                            >
                                Continuar →
                            </Button>
                        </div>
                    </div>
                </Card>

                {lastEvalResult && (
                    <div className={`p-4 rounded-lg border content-center ${lastEvalResult.score >= 1 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg">Resultado: {lastEvalResult.score}/{lastEvalResult.maxScore}</h3>
                                <p className="text-sm opacity-75">Confianza: {(lastEvalResult.confidence * 100).toFixed(0)}%</p>
                            </div>
                            {lastEvalResult.unscorable && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">NO EVALUABLE</span>}
                        </div>

                        <p className="mb-4 font-medium">{lastEvalResult.overallNotes}</p>

                        {lastEvalResult.checks && (
                            <div className="space-y-2 mt-4 text-sm">
                                <h4 className="font-semibold border-b pb-1 border-current opacity-20">Detalles de Criterios:</h4>
                                {Object.entries(lastEvalResult.checks).map(([key, val]: [string, any]) => (
                                    val ? (
                                        <div key={key} className="flex gap-2">
                                            <span className={val.pass ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                                {val.pass ? "✓" : "✗"}
                                            </span>
                                            <div>
                                                <span className="capitalize font-medium">{key}: </span>
                                                <span className="opacity-80">{val.notes}</span>
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
