import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { IdentificationTaskId, IdentificationResultDTO } from '@moca/shared';

// Placeholder for images - User will add them to public/assets
const ANIMALS = [
    { id: 'NAMING_LION' as IdentificationTaskId, name: 'Lion', imgSrc: '/assets/lion.png' },
    { id: 'NAMING_RHINO' as IdentificationTaskId, name: 'Rhinoceros', imgSrc: '/assets/rhino.png' },
    { id: 'NAMING_CAMEL' as IdentificationTaskId, name: 'Camel', imgSrc: '/assets/camel.png' }
];

export default function NamingTest() {
    const { testId = 'demo-test' } = useParams();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState<Record<string, string>>({
        NAMING_LION: '',
        NAMING_RHINO: '',
        NAMING_CAMEL: ''
    });

    const [result, setResult] = useState<IdentificationResultDTO | null>(null);

    const handleChange = (id: string, val: string) => {
        setAnswers(prev => ({ ...prev, [id]: val }));
    };

    const handleEvaluate = () => {
        // Deterministic local scoring (as requested, NO API needed)
        // Accepted answers (case insensitive, trimmed)
        const ACCEPTED_ANSWERS: Record<string, string[]> = {
            NAMING_LION: ['leon', 'león', 'lion'],
            NAMING_RHINO: ['rinoceronte', 'rhino', 'rhinoceros'],
            NAMING_CAMEL: ['camello', 'camel', 'dromedario'] // Dromedary often accepted in casual context though scientifically different, strict MoCA manual says "Camel". We allow common variations.
        };

        const newResults: any = {};
        let score = 0;

        ANIMALS.forEach(animal => {
            const userVal = (answers[animal.id] || '').toLowerCase().trim();
            const correct = ACCEPTED_ANSWERS[animal.id].some(a => userVal.includes(a));
            if (correct) score++;

            newResults[animal.id] = {
                correct,
                userAnswer: answers[animal.id]
            };
        });

        setResult({
            totalScore: score,
            results: newResults
        });

        // Save to LocalStorage for Final Report
        localStorage.setItem(`moca_${testId}_naming`, score.toString());
    };

    const handleContinue = () => {
        // Navigate to next module (Memory)
        navigate(`/tests/${testId}/memory`);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Identificación (Nominación)</h1>
                    <span className="text-sm font-medium text-slate-500">Paso 4</span>
                </div>

                <Card className="bg-white">
                    <h2 className="text-xl font-semibold text-brand-700 mb-6">Instrucciones: Escriba el nombre de cada animal debajo de su imagen.</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ANIMALS.map((animal) => (
                            <div key={animal.id} className="flex flex-col items-center space-y-4">
                                <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                                    <img
                                        src={animal.imgSrc}
                                        alt="Animal to identify"
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            // Fallback if image not found
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=' + animal.name;
                                        }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={answers[animal.id]}
                                    onChange={(e) => handleChange(animal.id, e.target.value)}
                                    disabled={!!result} // Disable after evaluation
                                    placeholder="Nombre del animal..."
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none text-center font-medium"
                                />
                                {result && (
                                    <div className={`text-sm font-bold ${result.results[animal.id].correct ? 'text-green-600' : 'text-red-500'}`}>
                                        {result.results[animal.id].correct ? '✓ Correcto' : '✗ Incorrecto'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {result && (
                    <Card className={result.totalScore === 3 ? "bg-green-50 border-green-200" : "bg-white"}>
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">Puntaje Total: {result.totalScore} / 3</h3>
                            <p className="text-slate-600 mb-4">La evaluación se ha completado.</p>
                        </div>
                    </Card>
                )}

                <div className="flex justify-between border-t border-slate-200 pt-6">
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/tests/${testId}/visuospatial`)} // Go back to prev module
                    >
                        ← Anterior (Visuoespacial)
                    </Button>

                    {!result ? (
                        <Button onClick={handleEvaluate} className="bg-brand-600 hover:bg-brand-700 text-white">
                            Evaluar Respuestas
                        </Button>
                    ) : (
                        <Button onClick={handleContinue} variant="primary">
                            Continuar →
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
