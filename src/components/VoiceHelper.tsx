import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface VoiceHelperProps {
  language: Language;
  onTranscript?: (text: string) => void;
  textToSpeak?: string;
  autoSpeak?: boolean;
}

export default function VoiceHelper({
  language,
  onTranscript,
  textToSpeak,
  autoSpeak = false,
}: VoiceHelperProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  // Speak the provided text when requested or when it changes
  useEffect(() => {
    if (autoSpeak && textToSpeak && synth) {
      speakText(textToSpeak);
    }
    return () => {
      if (synth) synth.cancel();
    };
  }, [textToSpeak, autoSpeak, synth]);

  const speakText = (text: string) => {
    if (!synth) {
      setErrorMsg("Voice narration is not supported in this browser.");
      return;
    }

    synth.cancel(); // Stop any ongoing speech
    setIsSpeaking(true);

    // Determine target locale for TTS
    let langCode = 'en-IN';
    if (language === 'te') langCode = 'te-IN';
    if (language === 'hi') langCode = 'hi-IN';

    // Strip out markdown symbols for clean voice reading
    const cleanText = text
      .replace(/[*#`_\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly slower for low-literacy clarity

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsSpeaking(false);
    };

    // Try to select a regional voice if available
    const voices = synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(langCode));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    setErrorMsg(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Match language code
      let langCode = 'en-IN';
      if (language === 'te') langCode = 'te-IN';
      if (language === 'hi') langCode = 'hi-IN';
      recognition.lang = langCode;

      recognition.onstart = () => {
        setIsListening(true);
        if (synth) synth.cancel(); // Stop talking while listening
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onTranscript && transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg("Microphone permission denied. Please allow mic in browser settings.");
        } else {
          setErrorMsg("Could not hear you clearly. Please try speaking again.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e: any) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full" id="voice-helper-container">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {isListening || isSpeaking ? (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            ) : null}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isListening ? 'bg-rose-500' : isSpeaking ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
          </span>
          <span className="text-sm font-semibold font-sans text-slate-700">
            {isListening ? (
              <span className="text-rose-600 font-bold">
                {language === 'te' ? 'వినబడుతోంది... మాట్లాడండి' : language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak Now'}
              </span>
            ) : isSpeaking ? (
              <span className="text-emerald-600">
                {language === 'te' ? 'వాయిస్ చదువుతోంది...' : language === 'hi' ? 'आवाज पढ़ रहा है...' : 'Narrating Info...'}
              </span>
            ) : (
              <span>
                {language === 'te' ? 'సహాయ పోర్టల్ సిద్ధంగా ఉంది' : language === 'hi' ? 'सहायता पोर्टल तैयार है' : 'Jan Seva Voice Ready'}
              </span>
            )}
          </span>
        </div>

        {/* Narrate Buttons */}
        <div className="flex items-center gap-2">
          {textToSpeak && (
            <button
              id="voice-narrate-btn"
              onClick={() => isSpeaking ? stopSpeaking() : speakText(textToSpeak)}
              className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium border transition-all ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                  : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
              }`}
              title="Listen to this page out loud"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  <span>{language === 'te' ? 'ఆపండి' : language === 'hi' ? 'रोकें' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>{language === 'te' ? 'వాయిస్ వినండి' : language === 'hi' ? 'आवाज सुनें' : 'Listen Info'}</span>
                </>
              )}
            </button>
          )}

          {onTranscript && (
            <button
              id="voice-record-btn"
              onClick={startListening}
              disabled={isListening}
              className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium border transition-all ${
                isListening
                  ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  : 'bg-govblue text-white border-[#0d1f39] hover:bg-govblue/90'
              }`}
              title="Click and speak naturally"
            >
              <Mic className="w-5 h-5" />
              <span>{isListening ? (language === 'te' ? 'రికార్డింగ్...' : language === 'hi' ? 'रिकॉर्डिंग...' : 'Listening...') : (language === 'te' ? 'మాట్లాడండి' : language === 'hi' ? 'बोलें' : 'Speak')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Animation soundwaves during activity */}
      {(isSpeaking || isListening) && (
        <div className="flex items-center justify-center gap-1.5 py-2 w-full bg-slate-100/50 rounded-xl" id="soundwave-animation">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-emerald-500 transition-all duration-300`}
              style={{
                height: `${Math.floor(Math.random() * 24) + 6}px`,
                animation: isListening ? `bounce 0.8s ease-in-out infinite alternate ${i * 0.05}s` : `bounce 1.2s ease-in-out infinite alternate ${i * 0.08}s`,
                backgroundColor: isListening ? '#f43f5e' : '#10b981'
              }}
            />
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2 text-rose-600 text-xs w-full bg-rose-50 p-2.5 rounded-xl border border-rose-100" id="voice-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-sans font-medium">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
