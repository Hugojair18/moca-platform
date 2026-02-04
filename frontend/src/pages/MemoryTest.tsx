import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { MemoryWord } from '@moca/shared';

const WORDS: MemoryWord[] = ['ROSTRO', 'SEDA', 'IGLESIA', 'CLAVEL', 'ROJO'];

// Web Speech API Types
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export default function MemoryTest() {
    const { testId = 'demo-test' } = useParams();
    const navigate = useNavigate();

    const [trial, setTrial] = useState<1 | 2>(1);
    const [isReading, setIsReading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Track checked words for each trial
    const [trial1Checks, setTrial1Checks] = useState<MemoryWord[]>([]);
    const [trial2Checks, setTrial2Checks] = useState<MemoryWord[]>([]);

    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

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
                const rawTranscript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join(' ');

                setTranscript(rawTranscript);
                const transcript = rawTranscript.toUpperCase();

                // Check if any word is in the transcript
                WORDS.forEach(word => {
                    // Simple inclusion check
                    if (transcript.includes(word)) {
                        markWord(word);
                    }
                });
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [trial]);

    const markWord = (word: MemoryWord) => {
        if (trial === 1) {
            setTrial1Checks(prev => prev.includes(word) ? prev : [...prev, word]);
        } else {
            setTrial2Checks(prev => prev.includes(word) ? prev : [...prev, word]);
        }
    };



    const readWords = () => {
        if (!('speechSynthesis' in window)) {
            alert("Tu navegador no soporta texto a voz.");
            return;
        }

        setIsReading(true);
        const utterance = new SpeechSynthesisUtterance(WORDS.join('. ')); // Pause between words
        utterance.lang = 'es-ES';
        utterance.rate = 0.8; // Slower pace
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Tu navegador no soporta reconocimiento de voz.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
            setTranscript('');
        }
    };

    const handleNextTrial = () => {
        if (trial === 1) {
            setTrial(2);
            setTranscript('');
            if (isListening) toggleListening();
        } else {
            // Finish
            console.log("Memory Test Results:", { trial1: trial1Checks, trial2: trial2Checks });
            alert("Instrucción Final: 'Recuerde estas palabras, se las pediré de nuevo al final de la prueba'.");
            // Navigate to next module (Attention)
            navigate(`/tests/${testId}/attention`);
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Memoria (Recuerdo Inmediato)</h1>
                    <span className="text-sm font-medium text-slate-500">Paso 5 - Intento {trial} de 2</span>
                </div>

                <Card className="bg-white p-8">
                    <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start gap-3">
                        <span className="text-2xl">📢</span>
                        <div>
                            <p className="font-bold">Instrucción al Paciente:</p>
                            <p>"Voy a leerle una lista de palabras que debe recordar ahora y más tarde. Escuche con atención y cuando yo termine, dígame todas las palabras que pueda recordar."</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-8">

                        {/* Status Icon */}
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-500 ${isListening ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-200' :
                            isReading ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-200' : 'bg-slate-100 text-slate-400'
                            }`}>
                            {isListening ? '🎙️' : isReading ? '🔊' : '👂'}
                        </div>

                        {/* Transcript Feedback */}
                        <div className="w-full max-w-md min-h-[100px] p-6 bg-slate-50 rounded-xl border-2 border-slate-100 text-center">
                            {isReading ? (
                                <p className="text-slate-500 italic">Escuchando lista de palabras...</p>
                            ) : isListening ? (
                                <div>
                                    <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Tu Respuesta</p>
                                    <p className="text-xl text-slate-700 font-medium">
                                        {transcript || <span className="text-slate-300">...habla ahora...</span>}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-400">Presiona "Escuchar Respuesta" cuando estés listo para repetir las palabras.</p>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button
                                onClick={readWords}
                                disabled={isReading || isListening}
                                variant="secondary"
                                className="w-48"
                            >
                                {isReading ? 'Leyendo...' : '🔊 Leer Palabras'}
                            </Button>

                            <Button
                                onClick={toggleListening}
                                disabled={isReading}
                                className={`w-48 transition-colors ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                                    }`}
                            >
                                {isListening ? '🛑 Detener' : '🎙️ Escuchar Respuesta'}
                            </Button>
                        </div>
                    </div>
                </Card>



                <div className="flex justify-between border-t border-slate-200 pt-6">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            if (trial === 2) setTrial(1);
                            else navigate(`/tests/${testId}/naming`);
                        }}
                    >
                        ← Anterior
                    </Button>

                    <Button onClick={handleNextTrial} variant="primary">
                        {trial === 1 ? 'Siguiente Intento →' : 'Finalizar Sección →'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
