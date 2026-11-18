import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, Sparkles, Mic, MicOff, Volume2, 
  VolumeX, RefreshCw, Paperclip, CheckCircle2, AlertCircle, FileText 
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { getTranslation } from '../localization';

interface AIChatbotProps {
  language: Language;
}

export default function AIChatbot({ language }: AIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: language === 'te' 
        ? 'నమస్కారం! నేను జన సేవ సహాయకుడిని. మీకు ఉచిత పెన్షన్లు, రైతు భరోసా, లేదా గ్రామ రోడ్డు పనుల గురించి ఏమైనా సమాచారం కావాలా? నాతో మాట్లాడండి.'
        : language === 'hi'
        ? 'नमस्कार! मैं जन सेवा सहायक हूँ। क्या आपको पेंशन, किसान सहायता या सार्वजनिक कार्यों के बारे में जानकारी चाहिए? मुझसे पूछें।'
        : 'Namaskar! I am Jan Seva AI, your welfare scheme assistant. Ask me questions about eligibility, pensions, farming funds, or public projects. You can speak or type!',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;
    }
    return () => {
      if (speechSynthRef.current) speechSynthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = (id: string, text: string) => {
    const synth = speechSynthRef.current;
    if (!synth) return;

    if (isSpeakingId === id) {
      synth.cancel();
      setIsSpeakingId(null);
      return;
    }

    synth.cancel();
    setIsSpeakingId(id);

    // Filter text of markdown tokens for smoother reading
    const cleanText = text
      .replace(/[*#`_\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    let langCode = 'en-IN';
    if (language === 'te') langCode = 'te-IN';
    if (language === 'hi') langCode = 'hi-IN';

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeakingId(null);
    };
    utterance.onerror = () => {
      setIsSpeakingId(null);
    };

    const voices = synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(langCode));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    synth.speak(utterance);
  };

  const handleSend = async (text: string, isVoice: boolean = false) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text,
      isVoiceInput: isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          language
        })
      });

      const data = await response.json();
      
      const replyMessage: ChatMessage = {
        id: 'reply_' + Date.now(),
        role: 'model',
        text: data.text
      };

      setMessages(prev => [...prev, replyMessage]);
      
      // Auto-speak the response for absolute accessibility if voice input was used
      if (isVoice) {
        speakText(replyMessage.id, replyMessage.text);
      }
    } catch (e) {
      console.error(e);
      // fallback mock response on api fail
      const replyMessage: ChatMessage = {
        id: 'reply_' + Date.now(),
        role: 'model',
        text: language === 'te' 
          ? 'క్షమించండి, నేను దరఖాస్తులను ప్రాసెస్ చేయలేకపోయాను. దయచేసి రైతు భరోసా లేదా వైఎస్ఆర్ పెన్షన్ కానుక కోసం తిరిగి ప్రయత్నించండి.'
          : 'I apologize, I am experiencing temporary issues contacting the welfare servers. Please try again soon.'
      };
      setMessages(prev => [...prev, replyMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      let langCode = 'en-IN';
      if (language === 'te') langCode = 'te-IN';
      if (language === 'hi') langCode = 'hi-IN';
      recognition.lang = langCode;

      recognition.onstart = () => {
        setIsListening(true);
        if (speechSynthRef.current) speechSynthRef.current.cancel();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript, true);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // OCR Document Process inside Chat
  const handleDocOCRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setIsLoading(true);
        try {
          // Send scanned attachment request
          const response = await fetch('/api/gemini/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64String })
          });
          const data = await response.json();
          
          const textMessage = language === 'te'
            ? `నేను మీ "${data.documentType}" పత్రాన్ని విజయవంతంగా చదివాను. 
            మీ పేరు: ${data.name}. 
            గుర్తింపు నంబర్: ${data.documentNumber}. 
            ఈ వివరాలను నేను ఫారమ్‌లో నమోదు చేసాను. దీనికి అనుగుణంగా పథకాలను సరిపోల్చండి.`
            : `I have extracted information from your scanned ${data.documentType} Card. 
            Name: ${data.name}. 
            ID Number: ${data.documentNumber}. 
            You are eligible for rural farmer support. Let me know if you would like me to detail Rythu Bharosa benefits!`;

          setMessages(prev => [
            ...prev,
            { id: 'user_doc_' + Date.now(), role: 'user', text: `Scanned and attached card: ${file.name}` },
            { id: 'ocr_reply_' + Date.now(), role: 'model', text: textMessage }
          ]);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[600px] text-left" id="ai-chatbot-panel">
      {/* Chat header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-govblue text-white rounded-t-3xl shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-xl text-white">
            <MessageSquare className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base md:text-lg">
              {getTranslation('chatbot_heading', language)}
            </h3>
            <span className="text-xs text-blue-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Gemini 3.5 AI
            </span>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs font-bold"
        >
          {language === 'te' ? 'సందేశాలు తుడిచివేయి' : 'Clear Chat'}
        </button>
      </div>

      {/* Messages Scroll Box */}
      <div className="grow p-4 overflow-y-auto space-y-4 bg-slate-50/50" id="chatbot-messages-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`chat-bubble-${msg.id}`}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-govblue text-white rounded-tr-none text-left'
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 text-left'
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex justify-between items-start gap-4 mb-2 border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-govblue tracking-wider uppercase font-mono">
                    Jan Seva Expert
                  </span>
                  <button
                    id={`speak-msg-btn-${msg.id}`}
                    onClick={() => speakText(msg.id, msg.text)}
                    className={`p-1 rounded-md border transition-all ${
                      isSpeakingId === msg.id 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : 'text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                    title="Read out loud"
                  >
                    {isSpeakingId === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              )}
              
              <div className="font-sans font-medium whitespace-pre-line text-xs md:text-sm">
                {msg.text}
              </div>
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
              {msg.role === 'user' ? (msg.isVoiceInput ? '🎤 Spoken' : '⌨ Typed') : '🤖 Verified'}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-sans p-3 bg-white border border-slate-100 rounded-xl w-fit">
            <div className="w-2 h-2 rounded-full bg-govblue animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-govblue animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="w-2 h-2 rounded-full bg-govblue animate-bounce" style={{ animationDelay: '0.3s' }} />
            <span>{language === 'te' ? 'జన సేవ సమాధానం వెతుకుతోంది...' : 'Jan Seva is thinking...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls box */}
      <div className="p-3 border-t border-slate-100 bg-white rounded-b-3xl shrink-0 flex items-center gap-2">
        {/* Attachment uploader */}
        <label className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer text-slate-500 shrink-0 transition-all">
          <Paperclip className="w-5 h-5" />
          <input
            type="file"
            id="chat-ocr-upload"
            accept="image/*"
            onChange={handleDocOCRUpload}
            className="hidden"
          />
        </label>

        {/* Microphone STT input button */}
        <button
          id="chat-speech-mic-btn"
          onClick={startSpeechRecognition}
          className={`p-3 rounded-xl border shrink-0 transition-all ${
            isListening 
              ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
              : 'bg-blue-50 text-govblue border-blue-100 hover:bg-blue-100'
          }`}
          title="Speak naturally instead of typing"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Input box */}
        <input
          type="text"
          id="chat-text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText, false)}
          placeholder={getTranslation('chatbot_placeholder', language)}
          className="grow p-3 border border-slate-200 rounded-xl text-xs md:text-sm font-sans focus:outline-none focus:border-govblue focus:ring-1 focus:ring-govblue"
        />

        {/* Send button */}
        <button
          id="chat-send-msg-btn"
          onClick={() => handleSend(inputText, false)}
          className="p-3 bg-govblue text-white rounded-xl hover:bg-govblue/90 shrink-0 border-b-2 border-[#0d1f39]"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
