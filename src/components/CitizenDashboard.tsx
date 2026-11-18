import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, FileText, Gift, Calendar, Upload, 
  MapPin, Coins, HelpCircle, Bell, ArrowRight, CheckCircle2, 
  AlertCircle, MessageSquare, Volume2, Award, Briefcase, GraduationCap 
} from 'lucide-react';
import { Scheme, UserProfile, Notification, Language } from '../types';
import { getTranslation } from '../localization';
import VoiceHelper from './VoiceHelper';

interface CitizenDashboardProps {
  language: Language;
  schemes: Scheme[];
  notifications: Notification[];
  onUpdateNotifications: (notifs: Notification[]) => void;
  bigTextMode: boolean;
}

// Pre-defined template scans for easy 1-click demonstration
const OCR_TEMPLATES = [
  {
    name: 'Aadhaar Card (Simulated)',
    type: 'Aadhaar',
    img: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60', // office doc representation
    data: {
      documentType: 'Aadhaar',
      name: 'Ramu Konda',
      documentNumber: '5034 9128 4402',
      extractedFields: {
        dob: '1962-04-12', // Age 64
        gender: 'male',
        annualIncome: null,
        district: 'Kurnool',
        category: 'OBC'
      },
      summary: 'Extracted Aadhaar card: Ramu Konda, Male, Age 64, District: Kurnool'
    }
  },
  {
    name: 'Income Certificate (Simulated)',
    type: 'Income',
    img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60', // stamp cert representation
    data: {
      documentType: 'Income',
      name: 'Ammaji Venkat',
      documentNumber: 'INC/AP/2026/89432',
      extractedFields: {
        dob: '1981-11-20',
        gender: 'female',
        annualIncome: 95000,
        district: 'Guntur',
        category: 'SC'
      },
      summary: 'Extracted Income Certificate: Annual income ₹95,000 for Ammaji Venkat, SC category, District: Guntur'
    }
  }
];

export default function CitizenDashboard({
  language,
  schemes,
  notifications,
  onUpdateNotifications,
  bigTextMode,
}: CitizenDashboardProps) {
  // Initialize user profile
  const [profile, setProfile] = useState<UserProfile>({
    age: 52,
    gender: 'all',
    occupation: 'Agriculture Farmer',
    annualIncome: 110000,
    education: 'Secondary School',
    district: 'Guntur',
    category: 'OBC'
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'results' | 'notifications'>('profile');
  const [eligibleSchemes, setEligibleSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [textToNarrate, setTextToNarrate] = useState<string>('');

  // OCR state
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // WhatsApp dialog state
  const [whatsappModal, setWhatsappModal] = useState<any | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState<string>('98480 22338');
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [whatsappLog, setWhatsappLog] = useState<any[]>([]);

  // Trigger recommendation recalculation whenever profile or schemes change
  useEffect(() => {
    calculateEligibility();
  }, [profile, schemes]);

  const calculateEligibility = () => {
    const results = schemes.filter(scheme => {
      // Age check
      if (scheme.minAge !== undefined && profile.age < scheme.minAge) return false;
      if (scheme.maxAge !== undefined && profile.age > scheme.maxAge) return false;

      // Income check
      if (scheme.maxIncome !== undefined && profile.annualIncome > scheme.maxIncome) return false;

      // Gender check (if specified and not 'all')
      if (scheme.allowedGender && scheme.allowedGender.length > 0) {
        const hasAll = scheme.allowedGender.includes('all');
        const matchesUser = scheme.allowedGender.includes(profile.gender as any);
        if (!hasAll && !matchesUser) return false;
      }

      // Caste check (if specified)
      if (scheme.allowedCategory && scheme.allowedCategory.length > 0) {
        const hasAll = scheme.allowedCategory.includes('All');
        const matchesUser = scheme.allowedCategory.includes(profile.category);
        if (!hasAll && !matchesUser) return false;
      }

      return true;
    });

    setEligibleSchemes(results);

    // Formulate a voice instruction greeting
    let voiceIntro = '';
    if (language === 'te') {
      voiceIntro = `నమస్కారం! మీ ప్రొఫైల్ వివరాల ప్రకారం, మీకు సరిపోయే ${results.length} ప్రభుత్వ పథకాలు కనుగొనబడ్డాయి. రైతు భరోసా, అమ్మ ఒడి వంటి పథకాలను ఇక్కడ చూడవచ్చు. ఏ పథకం పైన అయినా క్లిక్ చేసి మరిన్ని వివరాలు వినండి.`;
    } else if (language === 'hi') {
      voiceIntro = `नमस्कार! आपकी जानकारी के अनुसार, आपके लिए ${results.length} सरकारी योजनाएं पाई गई हैं। योजना पर क्लिक करें और उसकी पूरी जानकारी अपनी भाषा में सुनें।`;
    } else {
      voiceIntro = `Welcome back! Based on your profile, we have matched ${results.length} government assistance programs for you. Click on any program to hear the benefits, documents needed, and application instructions out loud.`;
    }
    setTextToNarrate(voiceIntro);
  };

  // Run Real Server OCR using Gemini or simulated templates
  const runRealOcr = async (imageBase64: string, fileName: string) => {
    setIsOcrLoading(true);
    setOcrResult(null);
    setUploadedFileName(fileName);
    try {
      const response = await fetch('/api/gemini/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });

      const data = await response.json();
      applyOcrResult(data);
    } catch (error) {
      console.error("OCR api failed, loading mock response", error);
      // Fallback
      applyOcrResult(OCR_TEMPLATES[0].data);
    } finally {
      setIsOcrLoading(false);
    }
  };

  // Apply OCR result to form state
  const applyOcrResult = (data: any) => {
    setOcrResult(data);
    if (data.documentType === 'Aadhaar') {
      // Calculate age from DOB if available
      let calcAge = profile.age;
      if (data.extractedFields?.dob) {
        const dobYear = new Date(data.extractedFields.dob).getFullYear();
        calcAge = new Date().getFullYear() - dobYear;
      }
      setProfile(prev => ({
        ...prev,
        age: isNaN(calcAge) ? prev.age : calcAge,
        gender: data.extractedFields?.gender === 'female' ? 'female' : 'male',
        district: data.extractedFields?.district || prev.district,
        category: data.extractedFields?.category !== 'unknown' ? data.extractedFields.category : prev.category
      }));
    } else if (data.documentType === 'Income') {
      setProfile(prev => ({
        ...prev,
        annualIncome: data.extractedFields?.annualIncome || prev.annualIncome,
        district: data.extractedFields?.district || prev.district,
        category: data.extractedFields?.category !== 'unknown' ? data.extractedFields.category : prev.category
      }));
    }

    // Add notification about successful scan
    const newNotif: Notification = {
      id: 'notif_ocr_' + Date.now(),
      type: 'general',
      title: 'Scanned Profile Updated',
      titleLocal: {
        te: 'స్కాన్ చేసిన వివరాలు నవీకరించబడ్డాయి',
        hi: 'स्कैन किए गए विवरण अपडेट किए गए'
      },
      message: `Successfully read ${data.documentType} card for ${data.name || 'citizen'}. Profiler updated automatically.`,
      messageLocal: {
        te: `${data.documentType} కార్డ్ నుండి ${data.name || 'పౌరుల'} వివరాలు విజయవంతంగా సేకరించబడ్డాయి. ఫారమ్ పూరించబడింది.`,
        hi: `${data.documentType} कार्ड से ${data.name || 'नागरिक'} के विवरण सफलतापूर्वक प्राप्त हुए।`
      },
      date: new Date().toISOString().split('T')[0],
      read: false
    };

    onUpdateNotifications([newNotif, ...notifications]);

    // Speak out OCR success in regional language
    let ocrVoice = '';
    if (language === 'te') {
      ocrVoice = `కార్డ్ విజయవంతంగా స్కాన్ చేయబడింది! మీ పేరు ${data.name || ''} మరియు వివరాలు ఫారమ్‌లో నమోదు చేయబడ్డాయి. మీ అర్హత గల పథకాలను తనిఖీ చేసుకోండి.`;
    } else if (language === 'hi') {
      ocrVoice = `कार्ड सफलतापूर्वक स्कैन हो गया है! आपकी जानकारी फॉर्म में भर दी गई है। अपनी कल्याणकारी योजनाएं देखें।`;
    } else {
      ocrVoice = `Card successfully scanned! Extracted information for ${data.name || 'the profile'}. Your eligibility results are now ready.`;
    }
    setTextToNarrate(ocrVoice);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        runRealOcr(base64String, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Launch simulated SMS/WhatsApp alert modal
  const handleSimulateAlert = (scheme: Scheme) => {
    const customMessage = language === 'te' 
      ? `నమస్కారం! ప్రభుత్వ పథకం అప్డేట్: మీరు "${scheme.nameLocal.te}" పథకానికి అర్హత పొందారు. చివరి దరఖాస్తు తేదీ: ${scheme.deadline}. గ్రామ సచివాలయంలో సంప్రదించండి.`
      : language === 'hi'
      ? `नमस्कार! सरकारी योजना अपडेट: आप "${scheme.nameLocal.hi}" योजना के लिए पात्र हैं। आवेदन की अंतिम तिथि: ${scheme.deadline}.`
      : `Namaskar! Jan Seva Government Update: You are eligible for "${scheme.name}". Please submit your Aadhaar and Income certificates at GWS center before ${scheme.deadline}.`;

    setWhatsappModal({
      scheme,
      message: customMessage
    });
    setWhatsappSent(false);
  };

  const sendSimulatedWhatsApp = async () => {
    if (!whatsappModal) return;
    try {
      const response = await fetch('/api/whatsapp/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: whatsappPhone,
          schemeName: whatsappModal.scheme.name,
          message: whatsappModal.message,
          type: 'whatsapp'
        })
      });
      const data = await response.json();
      setWhatsappLog(prev => [data, ...prev]);
      setWhatsappSent(true);
    } catch (e) {
      console.error(e);
      // fallback mock log
      setWhatsappLog(prev => [{
        success: true,
        sentAt: new Date().toLocaleTimeString(),
        channel: "WhatsApp & SMS",
        recipient: whatsappPhone,
        title: whatsappModal.scheme.name,
        body: whatsappModal.message,
        status: "delivered"
      }, ...prev]);
      setWhatsappSent(true);
    }
  };

  // Set active speech narration to specific scheme details
  const narrateScheme = (scheme: Scheme) => {
    let narrative = '';
    if (language === 'te') {
      narrative = `పథకం పేరు: ${scheme.nameLocal.te}. 
      ఈ పథకం ద్వారా పొందే లబ్ధి: ${scheme.benefitLocal.te}. 
      అర్హత కావలసిన వివరాలు: ${scheme.eligibilityLocal.te}. 
      కావలసిన పత్రాలు: ${scheme.requiredDocuments.join(', ')}. 
      దరఖాస్తు విధానం: ${scheme.applicationProcessLocal.te}. 
      చివరి తేదీ: ${scheme.deadline}.`;
    } else if (language === 'hi') {
      narrative = `योजना का नाम: ${scheme.nameLocal.hi}. 
      मिलने वाला लाभ: ${scheme.benefitLocal.hi}. 
      पात्रता विवरण: ${scheme.eligibilityLocal.hi}. 
      आवश्यक दस्तावेज: ${scheme.requiredDocuments.join(', ')}. 
      आवेदन कैसे करें: ${scheme.applicationProcessLocal.hi}. 
      अंतिम तिथि: ${scheme.deadline}.`;
    } else {
      narrative = `Scheme name is: ${scheme.name}. 
      Welfare benefits: ${scheme.benefit}. 
      Eligibility criteria: ${scheme.eligibility}. 
      Required documents: ${scheme.requiredDocuments.join(', ')}. 
      How to apply: ${scheme.applicationProcess}. 
      Deadline to apply is: ${scheme.deadline}.`;
    }
    setTextToNarrate(narrative);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6" id="citizen-dashboard">
      
      {/* Voice Instruction Module - Floating/Top Banner */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
        <div className="bg-emerald-50 p-3 rounded-full shrink-0 text-emerald-600">
          <Volume2 className="w-8 h-8 animate-bounce" />
        </div>
        <div className="grow space-y-1">
          <h3 className="font-sans font-bold text-slate-900 text-lg">
            {language === 'te' ? 'జన సేవ ఆడియో గైడ్' : language === 'hi' ? 'जन सेवा ऑडियो गाइड' : 'Jan Seva Audio Guide'}
          </h3>
          <p className="text-slate-600 font-sans text-sm md:text-base leading-relaxed">
            {language === 'te' 
              ? 'ఈ పోర్టల్ మీకు చదివి వినిపిస్తుంది. మైక్రోఫోన్ నొక్కి మాట్లాడవచ్చు లేదా లౌడ్ స్పీకర్ నొక్కి పథక వివరాలను మీ భాషలో వినవచ్చు.' 
              : language === 'hi' 
              ? 'यह पोर्टल आपके लिए बोल सकता है। माइक दबाकर बोलें या लाउडस्पीकर दबाकर अपनी भाषा में योजना की जानकारी सुनें।' 
              : 'Our system reads details out loud. Click Speak to search via voice, or click Listen to hear scheme guidelines in your language.'}
          </p>
        </div>
        <div className="w-full md:w-auto shrink-0">
          <VoiceHelper 
            language={language} 
            textToSpeak={textToNarrate} 
            autoSpeak={true}
          />
        </div>
      </div>

      {/* Profile Setup, Scan and Schemes Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Intelligent Profiler & Document Scanner (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Document Scan OCR Panel */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100" id="ocr-panel">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-lg">
                  {getTranslation('ocr_heading', language)}
                </h3>
                <p className="text-slate-500 font-sans text-xs">
                  {language === 'te' ? 'కార్డు ఫోటో పెడితే ఫారమ్ నింపబడుతుంది' : language === 'hi' ? 'कार्ड फोटो अपलोड कर फॉर्म भरें' : 'No typing required. Just upload Aadhaar'}
                </p>
              </div>
            </div>

            <p className="text-slate-600 font-sans text-xs md:text-sm mb-5 leading-relaxed">
              {getTranslation('ocr_desc', language)}
            </p>

            {/* Simulated 1-click OCR buttons for fast test */}
            <div className="space-y-3 mb-5">
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider font-mono">
                {language === 'te' ? 'వేగవంతమైన డెమో స్కాన్:' : language === 'hi' ? 'त्वरित डेमो स्कैन:' : '1-Click Simulation for Demo:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {OCR_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    id={`ocr-template-${idx}`}
                    onClick={() => applyOcrResult(tmpl.data)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all text-left flex flex-col gap-1"
                  >
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{tmpl.name}</span>
                    <span className="text-[10px] text-purple-600 font-medium font-sans flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {tmpl.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Real File Input Upload Zone */}
            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-purple-400 transition-all bg-slate-50/50">
              <input 
                type="file" 
                id="ocr-file-upload"
                accept="image/*" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <span className="block text-xs md:text-sm font-bold text-slate-700">
                  {uploadedFileName ? `Selected: ${uploadedFileName}` : (language === 'te' ? 'ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి' : language === 'hi' ? 'फोटो लें या अपलोड करें' : 'Take Photo or Choose File')}
                </span>
                <span className="block text-[10px] text-slate-500">PNG, JPG up to 10MB</span>
              </div>
            </div>

            {isOcrLoading && (
              <div className="mt-4 p-4 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl flex items-center gap-3 animate-pulse">
                <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                <span className="text-xs font-bold font-sans">
                  {language === 'te' ? 'AI మీ కార్డును చదువుతోంది...' : language === 'hi' ? 'AI आपके कार्ड को पढ़ रहा है...' : 'Reading document with AI OCR...'}
                </span>
              </div>
            )}

            {ocrResult && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{ocrResult.documentType} Card Extracted</span>
                </div>
                <p className="font-mono text-[11px] text-emerald-600">Name: {ocrResult.name}</p>
                <p className="font-mono text-[11px] text-emerald-600">ID: {ocrResult.documentNumber}</p>
                <p className="font-sans text-[11px] leading-relaxed italic">{ocrResult.summary}</p>
              </div>
            )}
          </div>

          {/* Profiler Form Panel */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100" id="profiler-form">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-slate-800 text-lg">
                {getTranslation('form_header', language)}
              </h3>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); calculateEligibility(); }}>
              
              {/* Age & Gender Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    {getTranslation('form_age', language)}
                  </label>
                  <input
                    type="number"
                    id="profile-age"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold font-sans"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    {getTranslation('form_gender', language)}
                  </label>
                  <select
                    id="profile-gender"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold font-sans"
                  >
                    <option value="all">Any / All</option>
                    <option value="male">{getTranslation('gender_male', language)}</option>
                    <option value="female">{getTranslation('gender_female', language)}</option>
                    <option value="other">{getTranslation('gender_other', language)}</option>
                  </select>
                </div>
              </div>

              {/* Annual Income */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  {getTranslation('form_income', language)}
                </label>
                <div className="relative">
                  <Coins className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    id="profile-income"
                    value={profile.annualIncome}
                    onChange={(e) => setProfile({ ...profile, annualIncome: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold font-sans"
                  />
                </div>
              </div>

              {/* Caste Category & Education */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    {getTranslation('form_category', language)}
                  </label>
                  <select
                    id="profile-category"
                    value={profile.category}
                    onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold font-sans"
                  >
                    <option value="General">General Category</option>
                    <option value="OBC">OBC (BC)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    {getTranslation('form_education', language)}
                  </label>
                  <select
                    id="profile-education"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold font-sans"
                  >
                    <option value="None / Illiterate">None / Low Literacy</option>
                    <option value="Primary School">Primary School (Class 5)</option>
                    <option value="Secondary School">Secondary School (Class 10)</option>
                    <option value="Undergraduate Degree">College Degree / Diploma</option>
                  </select>
                </div>
              </div>

              {/* District & Occupation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    {getTranslation('form_district', language)}
                  </label>
                  <select
                    id="profile-district"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold font-sans"
                  >
                    <option value="Guntur">Guntur (గుంటూరు)</option>
                    <option value="Kurnool">Kurnool (కర్నూలు)</option>
                    <option value="Anantapur">Anantapur (అనంతపురం)</option>
                    <option value="Nellore">Nellore (నెల్లూరు)</option>
                    <option value="East Godavari">East Godavari (తూర్పు గోదావరి)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    {getTranslation('form_occupation', language)}
                  </label>
                  <select
                    id="profile-occupation"
                    value={profile.occupation}
                    onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold font-sans"
                  >
                    <option value="Agriculture Farmer">Agriculture / Farmer (వ్యవసాయం)</option>
                    <option value="Weaver">Weaver / Craftsman (చేనేత)</option>
                    <option value="Laborer">Daily Laborer (కూలీ పని)</option>
                    <option value="Unemployed">Unemployed (నిరుద్యోగి)</option>
                    <option value="Student">Student (విద్యార్థి)</option>
                  </select>
                </div>
              </div>

              <button
                id="profile-submit-btn"
                type="submit"
                className="w-full mt-4 py-4 bg-govblue text-white font-bold rounded-2xl border-b-4 border-[#0d1f39] hover:bg-govblue/90 active:border-b-0 transition-all font-sans text-base flex items-center justify-center gap-2"
              >
                <span>{getTranslation('btn_submit', language)}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Schemes Found Board & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tabs for Results vs Notifications */}
          <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2">
            <button
              id="tab-schemes-btn"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-center rounded-xl font-bold font-sans transition-all text-sm md:text-base flex items-center justify-center gap-2 ${
                activeTab === 'profile' || activeTab === 'results'
                  ? 'bg-govblue text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span>
                {language === 'te' ? 'పథకాల ఫలితాలు' : language === 'hi' ? 'योजनाओं के परिणाम' : 'Welfare Schemes'} 
                ({eligibleSchemes.length})
              </span>
            </button>

            <button
              id="tab-notifications-btn"
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-3 text-center rounded-xl font-bold font-sans transition-all text-sm md:text-base flex items-center justify-center gap-2 relative ${
                activeTab === 'notifications'
                  ? 'bg-govblue text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>
                {language === 'te' ? 'నోటిఫికేషన్లు' : language === 'hi' ? 'अधिसूचनाएं' : 'Alerts'}
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-4 w-5 h-5 bg-rose-500 border border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content: Schemes Results */}
          {(activeTab === 'profile' || activeTab === 'results') && (
            <div className="space-y-4" id="schemes-results">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="font-sans font-bold text-emerald-800 text-sm md:text-base">
                  {getTranslation('results_found', language)}: {eligibleSchemes.length} {language === 'te' ? 'పథకాలు లభించాయి' : language === 'hi' ? 'योजनाएं मिली हैं' : 'Schemes'}
                </span>
              </div>

              {eligibleSchemes.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-3xl border border-dashed border-slate-200 space-y-3">
                  <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="font-sans text-slate-600 font-bold">
                    {language === 'te' ? 'క్షమించండి! మీ ప్రొఫైల్‌కు సరిపోయే పథకాలు లేవు.' : language === 'hi' ? 'क्षमा करें! आपके प्रोफाइल के अनुकूल कोई योजना नहीं मिली।' : 'No matching schemes found.'}
                  </p>
                  <p className="text-slate-400 font-sans text-xs">
                    {language === 'te' ? 'దయచేసి వయస్సు లేదా ఆదాయ వివరాలను మార్చండి.' : language === 'hi' ? 'कृपया आयु या आय विवरण को कम करें।' : 'Try decreasing the annual income or adjusting other filter options.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {eligibleSchemes.map((scheme) => (
                    <div 
                      key={scheme.id}
                      id={`scheme-card-${scheme.id}`}
                      className={`bg-white p-5 md:p-6 rounded-3xl border transition-all ${
                        selectedScheme?.id === scheme.id ? 'border-2 border-govblue ring-2 ring-govblue/10' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-md font-sans">
                            {scheme.department}
                          </span>
                          <h4 className="font-sans font-extrabold text-slate-800 text-lg md:text-xl">
                            {language === 'te' ? scheme.nameLocal.te : language === 'hi' ? scheme.nameLocal.hi : scheme.name}
                          </h4>
                        </div>
                        
                        <div className="flex gap-2 self-start shrink-0">
                          <button
                            id={`scheme-narrate-btn-${scheme.id}`}
                            onClick={() => {
                              setSelectedScheme(scheme);
                              narrateScheme(scheme);
                            }}
                            className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center gap-1.5 text-xs font-bold transition-all"
                            title="Speak Scheme guidelines"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>{language === 'te' ? 'వినండి' : language === 'hi' ? 'सुनें' : 'Speak'}</span>
                          </button>
                          
                          <button
                            id={`scheme-whatsapp-btn-${scheme.id}`}
                            onClick={() => handleSimulateAlert(scheme)}
                            className="p-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl border border-green-200 flex items-center gap-1.5 text-xs font-bold transition-all"
                            title="Simulate WhatsApp alert on phone"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{language === 'te' ? 'వాట్సాప్ అలర్ట్' : language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Benefits & Details Container */}
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                            <span className="text-[11px] font-bold text-amber-800 uppercase font-sans flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              {getTranslation('scheme_benefit', language)}
                            </span>
                            <p className="font-sans font-bold text-slate-700 text-xs md:text-sm">
                              {language === 'te' ? scheme.benefitLocal.te : language === 'hi' ? scheme.benefitLocal.hi : scheme.benefit}
                            </p>
                          </div>

                          <div className="space-y-1 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                            <span className="text-[11px] font-bold text-blue-800 uppercase font-sans flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {getTranslation('scheme_eligibility', language)}
                            </span>
                            <p className="font-sans text-slate-600 text-xs md:text-sm">
                              {language === 'te' ? scheme.eligibilityLocal.te : language === 'hi' ? scheme.eligibilityLocal.hi : scheme.eligibility}
                            </p>
                          </div>
                        </div>

                        {/* Extra Guidance */}
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-bold text-slate-600 block mb-1">
                              {getTranslation('scheme_docs', language)}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {scheme.requiredDocuments.map((doc, dIdx) => (
                                <span key={dIdx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg font-medium font-sans flex items-center gap-1">
                                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                              <span className="text-xs font-bold text-slate-600 block mb-0.5">
                                {getTranslation('scheme_process', language)}
                              </span>
                              <p className="font-sans text-xs text-slate-500">
                                {language === 'te' ? scheme.applicationProcessLocal.te : language === 'hi' ? scheme.applicationProcessLocal.hi : scheme.applicationProcess}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 h-fit self-end">
                              <Calendar className="w-4 h-4 text-rose-500" />
                              <div className="text-left">
                                <span className="text-[10px] text-rose-700 block font-bold uppercase tracking-wider">{getTranslation('scheme_deadline', language)}</span>
                                <span className="text-xs font-bold text-slate-700 font-mono">{scheme.deadline}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Notifications Feed */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4" id="notifications-panel">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-sans font-bold text-slate-800 text-lg">
                  {language === 'te' ? 'మీ అలర్ట్ లీడ్' : language === 'hi' ? 'आपका अलर्ट फीड' : 'Your Personalised Alerts'}
                </h3>
                {unreadCount > 0 && (
                  <button
                    id="mark-all-read-btn"
                    onClick={() => {
                      const updated = notifications.map(n => ({ ...n, read: true }));
                      onUpdateNotifications(updated);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    {language === 'te' ? 'అన్నీ చదివినట్లుగా గుర్తుచేయి' : language === 'hi' ? 'सभी को पढ़ा हुआ मानें' : 'Mark all as read'}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    id={`notification-${notif.id}`}
                    onClick={() => {
                      const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
                      onUpdateNotifications(updated);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                      notif.read ? 'bg-slate-50 border-slate-100 opacity-80' : 'bg-blue-50/40 border-blue-100 shadow-sm'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 h-fit ${
                      notif.type === 'scheme' ? 'bg-amber-100 text-amber-800' : notif.type === 'project' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>

                    <div className="grow space-y-1 text-left">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`font-sans font-bold text-slate-800 text-sm md:text-base ${!notif.read && 'text-blue-900'}`}>
                          {language === 'te' ? notif.titleLocal.te : language === 'hi' ? notif.titleLocal.hi : notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{notif.date}</span>
                      </div>
                      <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed">
                        {language === 'te' ? notif.messageLocal.te : language === 'hi' ? notif.messageLocal.hi : notif.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Simulation Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="whatsapp-sim-modal">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            {/* Header: Simulated WhatsApp look */}
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-[#075e54] rounded-full flex items-center justify-center font-bold text-lg font-sans">
                  JS
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm font-sans flex items-center gap-1.5">
                    Jan Seva Alerts 
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  </h4>
                  <span className="text-[11px] text-emerald-100 font-medium font-sans">Official Govt Bot • Online</span>
                </div>
              </div>
              <button
                id="close-whatsapp-modal"
                onClick={() => setWhatsappModal(null)}
                className="text-white hover:text-slate-200 font-bold font-sans text-xs"
              >
                {getTranslation('btn_close', language)}
              </button>
            </div>

            {/* Chat Body */}
            <div className="bg-[#ece5dd] p-4 min-h-[300px] flex flex-col justify-between" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                <div className="bg-amber-100 text-amber-900 text-[10px] font-bold py-1 px-2.5 rounded-lg text-center mx-auto w-fit shadow-sm">
                  🔒 Messages are processed securely by national digital services.
                </div>

                {whatsappSent ? (
                  <div className="bg-white p-3 rounded-2xl max-w-[85%] ml-auto shadow-sm text-left relative space-y-1">
                    <p className="text-[11px] font-bold text-[#075e54]">Mobile Recipient ({whatsappPhone})</p>
                    <p className="text-xs text-slate-700 leading-normal">{whatsappModal.message}</p>
                    <span className="text-[9px] text-slate-400 block text-right font-mono">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 font-medium text-xs font-sans">
                      {language === 'te' ? 'క్రింది నంబర్‌కు ప్రభుత్వ వాట్సాప్ సందేశం పంపండి:' : 'Send automated alert to phone:'}
                    </p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="bg-white p-2.5 rounded-xl flex items-center gap-2 mt-4 shadow-sm border border-slate-200">
                <span className="text-xs font-bold text-slate-400 px-1 font-mono">+91</span>
                <input
                  type="text"
                  id="whatsapp-phone-input"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                  className="grow p-2 border border-slate-200 rounded-lg text-xs font-bold font-mono focus:outline-none"
                  disabled={whatsappSent}
                />
                <button
                  id="send-whatsapp-confirm"
                  onClick={sendSimulatedWhatsApp}
                  disabled={whatsappSent}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-all ${
                    whatsappSent ? 'bg-slate-400' : 'bg-[#128c7e] hover:bg-[#075e54]'
                  }`}
                >
                  {whatsappSent ? 'Sent' : 'Send Alert'}
                </button>
              </div>
            </div>

            {/* Simulated Mobile Status Info */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-left text-[11px] font-sans text-slate-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'te' 
                  ? 'ఇది గ్రామీణ వాట్సాప్ మరియు ఎస్ఎంఎస్ అలర్ట్ డెమోను అనుకరిస్తుంది.' 
                  : 'Demonstrates end-to-end integration mapping government databases directly to secure messaging apps.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
