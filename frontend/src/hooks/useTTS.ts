import { useState, useCallback } from 'react';

export const useTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string, rate: number = 0.9, lang: string = 'es-ES') => {
        if (!('speechSynthesis' in window)) {
            console.warn("TTS not supported");
            return;
        }

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            if (e.error === 'canceled' || e.error === 'interrupted') {
                setIsSpeaking(false);
                return;
            }
            console.error("TTS Error", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    const cancel = useCallback(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, cancel, isSpeaking };
};
