import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Task Configuration
const DIGITS_FORWARD = ['2', '1', '8', '5', '4'];
const DIGITS_BACKWARD = ['7', '4', '2'];
const LETTERS_SEQUENCE = "F B A C M N A A J K L B A F A K D E A A A J A M O F A A B".split(' ');

// Web Speech API Types
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export default function AttentionTest() {
    const { testId = 'demo-test' } = useParams();
    const navigate = useNavigate();

    // Steps: 0=Intro, 1=DigitsForward, 2=DigitsBackward, 3=Letters, 4=Serial7, 5=Finish
    const [currentStep, setCurrentStep] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    // Letters Tap State
    const [letterIndex, setLetterIndex] = useState(-1);
    const [tapErrors, setTapErrors] = useState(0); // taps on non-A or missed A

    const recognitionRef = useRef<any>(null);
    const [testResults, setTestResults] = useState<any>({});

    useEffect(() => {
        // Initialize Speech Recognition
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

        if (SpeechRecognitionConstructor) {
            const recognition = new SpeechRecognitionConstructor();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'es-ES';

            recognition.onresult = (event: any) => {
                const rawTranscript = Array.from(event.results as SpeechRecognitionResultList)
                    .map((result: any) => result[0].transcript)
                    .join(' ');

                setTranscript(rawTranscript);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech error", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                // Auto-restart if still supposed to be listening? Use manual toggle for now to be safe.
                if (isListening) recognition.start();
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    // --- Actions ---

    const readSequence = (sequence: string[], rate = 0.8, onChar?: (char: string, index: number) => void) => {
        if (!('speechSynthesis' in window)) return;
        setIsReading(true);
        setLetterIndex(-1);

        let currentIndex = 0;

        const speakNext = () => {
            if (currentIndex >= sequence.length) {
                setIsReading(false);
                setLetterIndex(-1);
                return;
            }

            const char = sequence[currentIndex];
            if (onChar) onChar(char, currentIndex);

            const utterance = new SpeechSynthesisUtterance(char);
            utterance.lang = 'es-ES';
            utterance.rate = rate;

            utterance.onend = () => {
                currentIndex++;
                setTimeout(speakNext, 1000); // 1 sec interval
            };

            window.speechSynthesis.speak(utterance);
        };

        speakNext();
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // --- Letters Logic ---
    const handleLetterTap = () => {
        // User taps button. Check if current letter is A
        if (currentStep === 3 && isReading && letterIndex >= 0) {
            const currentLetter = LETTERS_SEQUENCE[letterIndex];
            if (currentLetter !== 'A') {
                setTapErrors(prev => prev + 1);
                console.log("Error: Tapped on " + currentLetter);
            } else {
                console.log("Correct Tap on A");
            }
        }
    };

    // --- Navigation ---

    const nextStep = () => {
        // Save results if needed
        if (currentStep === 1) setTestResults({ ...testResults, digitsForward: transcript });
        if (currentStep === 2) setTestResults({ ...testResults, digitsBackward: transcript });
        if (currentStep === 3) setTestResults({ ...testResults, letterErrors: tapErrors });
        if (currentStep === 4) setTestResults({ ...testResults, serial7: transcript });

        if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
            setTranscript('');
            setTapErrors(0);
        } else {
            navigate(`/tests/${testId}/language`); // Next module
        }
    };

    // --- Renders ---

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Atención</h1>
                    <span className="text-sm font-medium text-slate-500">Paso {currentStep + 1} de 5</span>
                </div>

                <Card className="bg-white p-8">

                    {/* Intro */}
                    {currentStep === 0 && (
                        <div className="text-center space-y-6">
                            <h2 className="text-xl font-bold">Instrucciones</h2>
                            <p className="text-slate-600">Esta sección evaluará su atención mediante series de números, letras y cálculos matemáticos.</p>
                            <Button onClick={nextStep} variant="primary">Comenzar</Button>
                        </div>
                    )}

                    {/* Digits Forward */}
                    {currentStep === 1 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Serie Numérica (Directa)</h2>
                            <p className="text-blue-800 bg-blue-50 p-4 rounded-lg">"Voy a decirle algunos números. Escuche atentamente y cuando yo termine, repítalos exactamente como yo los dije."</p>

                            <div className="flex justify-center gap-4">
                                <Button onClick={() => readSequence(DIGITS_FORWARD)} disabled={isReading}>
                                    {isReading ? '🔊 Leyendo...' : '▶️ Reproducir Serie'}
                                </Button>
                                <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'secondary'}>
                                    {isListening ? '🛑 Detener Escucha' : '🎙️ Responder'}
                                </Button>
                            </div>

                            <div className="p-4 bg-slate-100 rounded-lg min-h-[60px]">
                                {transcript || <span className="text-slate-400 italic">Su respuesta aparecerá aquí...</span>}
                            </div>

                            <Button onClick={nextStep} className="w-full">Siguiente</Button>
                        </div>
                    )}

                    {/* Digits Backward */}
                    {currentStep === 2 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Serie Numérica (Inversa)</h2>
                            <p className="text-blue-800 bg-blue-50 p-4 rounded-lg">"Ahora voy a decirle otros números, pero cuando yo termine, repítalos AL REVÉS (hacia atrás)."</p>

                            <div className="flex justify-center gap-4">
                                <Button onClick={() => readSequence(DIGITS_BACKWARD)} disabled={isReading}>
                                    {isReading ? '🔊 Leyendo...' : '▶️ Reproducir Serie'}
                                </Button>
                                <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'secondary'}>
                                    {isListening ? '🛑 Detener Escucha' : '🎙️ Responder'}
                                </Button>
                            </div>

                            <div className="p-4 bg-slate-100 rounded-lg min-h-[60px]">
                                {transcript || <span className="text-slate-400 italic">Su respuesta aparecerá aquí...</span>}
                            </div>

                            <Button onClick={nextStep} className="w-full">Siguiente</Button>
                        </div>
                    )}

                    {/* Letters */}
                    {currentStep === 3 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Detección de Letras</h2>
                            <p className="text-blue-800 bg-blue-50 p-4 rounded-lg">"Voy a leerle una serie de letras. Cada vez que escuche la letra 'A', dé un golpecito con la mano (toque el botón)."</p>

                            <div className="flex items-center justify-center h-32">
                                <Button
                                    onClick={handleLetterTap}
                                    disabled={!isReading}
                                    className={`w-32 h-32 rounded-full text-2xl shadow-xl transition-all ${isReading ? 'bg-brand-600 hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    TAP 👋
                                </Button>
                            </div>

                            <Button
                                onClick={() => readSequence(LETTERS_SEQUENCE, 1, (_char, idx) => setLetterIndex(idx))}
                                disabled={isReading}
                                variant="secondary"
                            >
                                {isReading ? '🔊 Leyendo...' : '▶️ Iniciar Prueba'}
                            </Button>

                            <Button onClick={nextStep} className="w-full">Siguiente</Button>
                        </div>
                    )}

                    {/* Serial 7s */}
                    {currentStep === 4 && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-bold">Resta en Serie (7)</h2>
                            <p className="text-blue-800 bg-blue-50 p-4 rounded-lg">"Ahora, quiero que reste 7 de 100, y luego continúe restando 7 a la cifra anterior hasta que yo le diga que pare."</p>
                            <p className="text-sm text-slate-500">(Ejemplo: 100 - 7 = ?, ? - 7 = ...)</p>

                            <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'primary'} size="lg">
                                {isListening ? '🛑 Detener Escucha' : '🎙️ Comenzar a Hablar'}
                            </Button>

                            <div className="p-4 bg-slate-100 rounded-lg min-h-[100px] text-lg font-mono">
                                {transcript || <span className="text-slate-400 italic">Diga los números...</span>}
                            </div>

                            <Button onClick={nextStep} className="w-full">Finalizar Sección</Button>
                        </div>
                    )}

                    {/* Finish Step for Debugging/Transition */}
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
