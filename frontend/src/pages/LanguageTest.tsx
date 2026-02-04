import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Task Configuration
const SENTENCE_1 = "El gato se esconde bajo el sofá cuando los perros entran en la sala";
const SENTENCE_2 = "Espero que él le entregue el mensaje una vez que ella se lo pida";
const FLUENCY_TIME = 60; // seconds

// Web Speech API Types
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export default function LanguageTest() {
    const { testId = 'demo-test' } = useParams();
    const navigate = useNavigate();

    // Steps: 0=Intro, 1=Sentence1, 2=Sentence2, 3=FluencyIntro, 4=FluencyTask, 5=Finish
    const [currentStep, setCurrentStep] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    // Fluency State
    const [timeLeft, setTimeLeft] = useState(FLUENCY_TIME);
    const [wordCount, setWordCount] = useState(0);

    const recognitionRef = useRef<any>(null);
    const [testResults, setTestResults] = useState<any>({});

    useEffect(() => {
        // Initialize Speech Recognition
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        if (!SpeechRecognition && !webkitSpeechRecognition) return;

        const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.onresult = (event: any) => {
            const rawTranscript = Array.from(event.results as SpeechRecognitionResultList)
                .map((result: any) => result[0].transcript)
                .join(' ');

            setTranscript(rawTranscript);

            // Simple word count approximation for Fluency task
            if (currentStep === 4) {
                const words = rawTranscript.trim().split(/\s+/).filter(w => w.length > 0);
                setWordCount(words.length);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            // Auto-restart if in fluency task and still have time
            if (currentStep === 4 && timeLeft > 0 && isListening) {
                recognition.start();
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [currentStep, timeLeft]);

    // Timer logic
    useEffect(() => {
        let interval: any;
        if (currentStep === 4 && isListening && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        // Time's up
                        if (recognitionRef.current) recognitionRef.current.stop();
                        setIsListening(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentStep, isListening, timeLeft]);


    // --- Actions ---

    const readText = (text: string, rate = 0.9) => {
        if (!('speechSynthesis' in window)) return;
        setIsReading(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = rate;
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            if (currentStep === 4) setWordCount(0); // Reset for fluency
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // --- Navigation ---

    const nextStep = () => {
        // Save results
        if (currentStep === 1) setTestResults({ ...testResults, sentence1: transcript });
        if (currentStep === 2) setTestResults({ ...testResults, sentence2: transcript });
        if (currentStep === 4) setTestResults({ ...testResults, fluency: { words: transcript, count: wordCount } });

        if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
            setTranscript('');
            setIsListening(false);
            if (currentStep === 3) setTimeLeft(FLUENCY_TIME); // Reset timer before fluency task calls
        } else {
            navigate(`/tests/${testId}/abstraction`); // Next module
        }
    };

    // --- Renders ---

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Lenguaje</h1>
                    <span className="text-sm font-medium text-slate-500">Paso {currentStep + 1} de 6</span>
                </div>

                <Card className="bg-white p-8">

                    {/* Intro */}
                    {currentStep === 0 && (
                        <div className="text-center space-y-6">
                            <h2 className="text-xl font-bold">Instrucciones</h2>
                            <p className="text-slate-600">Esta sección evaluará sus habilidades de lenguaje mediante repetición de frases y fluidez verbal.</p>
                            <Button onClick={nextStep} variant="primary">Comenzar</Button>
                        </div>
                    )}

                    {/* Sentence 1 */}
                    {currentStep === 1 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Repetición de Frases (1)</h2>
                            <p className="text-blue-800 bg-blue-50 p-4 rounded-lg">"Le voy a leer una frase. Repítala exactamente cuando yo termine."</p>

                            <div className="flex justify-center gap-4">
                                <Button onClick={() => readText(SENTENCE_1)} disabled={isReading}>
                                    {isReading ? '🔊 Leyendo...' : '▶️ Escuchar Frase'}
                                </Button>
                                <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'secondary'}>
                                    {isListening ? '🛑 Detener' : '🎙️ Repetir'}
                                </Button>
                            </div>

                            <div className="p-4 bg-slate-100 rounded-lg min-h-[60px]">
                                {transcript || <span className="text-slate-400 italic">Su respuesta...</span>}
                            </div>

                            <Button onClick={nextStep} className="w-full">Siguiente</Button>
                        </div>
                    )}

                    {/* Sentence 2 */}
                    {currentStep === 2 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Repetición de Frases (2)</h2>
                            <p className="text-blue-800 bg-blue-50 p-4 rounded-lg">"Ahora le voy a leer otra frase. Repítala exactamente cuando yo termine."</p>

                            <div className="flex justify-center gap-4">
                                <Button onClick={() => readText(SENTENCE_2)} disabled={isReading}>
                                    {isReading ? '🔊 Leyendo...' : '▶️ Escuchar Frase'}
                                </Button>
                                <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'secondary'}>
                                    {isListening ? '🛑 Detener' : '🎙️ Repetir'}
                                </Button>
                            </div>

                            <div className="p-4 bg-slate-100 rounded-lg min-h-[60px]">
                                {transcript || <span className="text-slate-400 italic">Su respuesta...</span>}
                            </div>

                            <Button onClick={nextStep} className="w-full">Siguiente</Button>
                        </div>
                    )}

                    {/* Fluency Intro */}
                    {currentStep === 3 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Fluidez Verbal</h2>
                            <div className="bg-blue-50 p-4 rounded-lg text-left space-y-2 text-blue-900">
                                <p><strong>Instrucciones:</strong></p>
                                <p>Diga el mayor número posible de palabras que comiencen por la letra <strong>"P"</strong> en 1 minuto.</p>
                                <p>Ejemplo: "Pato", "Pera", "Piedra"...</p>
                                <ul className="list-disc pl-5 text-sm mt-2">
                                    <li>No diga nombres propios (ej. Pedro, París).</li>
                                    <li>No diga números.</li>
                                    <li>No diga palabras de la misma familia (ej. Pato, Patito).</li>
                                </ul>
                            </div>
                            <Button onClick={nextStep} variant="primary" size="lg">Estoy listo</Button>
                        </div>
                    )}

                    {/* Fluency Task */}
                    {currentStep === 4 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Fluidez Verbal (Letra P)</h2>

                            <div className="text-5xl font-mono font-bold text-slate-700 mb-4">
                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </div>

                            <div className="flex justify-center gap-4">
                                <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'primary'} size="lg">
                                    {isListening ? '🛑 Detener' : '🎙️ Comenzar (Inicia Tiempo)'}
                                </Button>
                            </div>

                            <div className="mt-4">
                                <span className="text-sm font-bold uppercase text-slate-500">Palabras Detectadas (Aprox): {wordCount}</span>
                                <div className="p-4 bg-slate-100 rounded-lg min-h-[100px] mt-2 text-left text-sm max-h-40 overflow-auto">
                                    {transcript || <span className="text-slate-400 italic">Las palabras aparecerán aquí...</span>}
                                </div>
                            </div>

                            {timeLeft === 0 && (
                                <Button onClick={nextStep} className="w-full animate-bounce">Tiempo terminado - Continuar</Button>
                            )}
                        </div>
                    )}

                    {/* Finish Step */}
                    {currentStep === 5 && (
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Sección Completada</h2>
                            <p>Resultados preliminares:</p>
                            <pre className="text-left bg-slate-100 p-4 rounded text-xs overflow-auto">
                                {JSON.stringify(testResults, null, 2)}
                            </pre>
                            <Button onClick={nextStep} className="mt-4">Continuar</Button>
                        </div>
                    )}

                </Card>
            </div>
        </div>
    );
}
