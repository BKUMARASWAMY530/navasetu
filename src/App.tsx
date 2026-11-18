import React, { useState } from 'react';
import { 
  Gift, Landmark, MessageSquare, ShieldCheck, Settings, 
  Sparkles, Languages, Accessibility, AlertCircle, Bell 
} from 'lucide-react';
import { Language, Scheme, Project, Notification } from './types';
import { INITIAL_SCHEMES, INITIAL_PROJECTS, INITIAL_NOTIFICATIONS } from './initialData';
import { getTranslation } from './localization';
import CitizenDashboard from './components/CitizenDashboard';
import TransparencyModule from './components/TransparencyModule';
import AIChatbot from './components/AIChatbot';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [bigTextMode, setBigTextMode] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<'schemes' | 'projects' | 'chatbot' | 'admin'>('schemes');

  // Global state collections
  const [schemes, setSchemes] = useState<Scheme[]>(INITIAL_SCHEMES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // Officers actions
  const handleAddScheme = (scheme: Scheme) => {
    setSchemes(prev => [scheme, ...prev]);
  };

  const handleDeleteScheme = (id: string) => {
    setSchemes(prev => prev.filter(s => s.id !== id));
  };

  const handleAddProject = (proj: Project) => {
    setProjects(prev => [proj, ...prev]);
  };

  const handleUpdateNotifications = (notifs: Notification[]) => {
    setNotifications(notifs);
  };

  return (
    <div 
      id="app-root-container"
      className={`min-h-screen bg-slate-50 flex flex-col transition-all duration-200 ${
        bigTextMode ? 'text-lg lg:text-xl' : 'text-sm lg:text-base'
      }`}
    >
      {/* Top Professional National Portal Banner */}
      <header className="bg-govblue text-white border-b-4 border-govorange sticky top-0 z-40 shadow-lg" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand Logo & National Seal Emulation */}
          <div className="flex items-center gap-4 text-left">
            <div className="bg-white p-1 rounded-full w-11 h-11 flex items-center justify-center shadow-md shrink-0">
              <div className="w-7 h-7 border-2 border-govblue rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-govblue rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-black text-white text-lg md:text-xl tracking-tight leading-none uppercase">
                  {getTranslation('app_title', language)}
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[9px] font-bold rounded-md flex items-center gap-1 shadow-sm shrink-0">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  GOVT SECURE
                </span>
              </div>
              <p className="text-orange-200 text-[10px] uppercase tracking-widest font-bold mt-0.5 opacity-90">
                {getTranslation('tagline', language)}
              </p>
            </div>
          </div>

          {/* Accessibility, Regional Language Selectors & User profile */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Accessibility Toggle */}
            <button
              id="accessibility-text-toggle"
              onClick={() => setBigTextMode(!bigTextMode)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                bigTextMode 
                  ? 'bg-govorange text-white border-govorange shadow-sm' 
                  : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
              }`}
              title="Toggle Large Fonts for easy reading"
            >
              <Accessibility className="w-4 h-4" />
              <span className="hidden sm:inline">
                {bigTextMode ? 'Standard Text' : 'Big Text Mode'}
              </span>
            </button>

            {/* Language Picker */}
            <div className="flex bg-white/10 rounded-xl p-1 gap-1 border border-white/10" id="language-toggle-bar">
              <button
                id="lang-selector-en"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-white text-govblue shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                ENGLISH
              </button>
              <button
                id="lang-selector-te"
                onClick={() => setLanguage('te')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'te' ? 'bg-white text-govblue shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
              <button
                id="lang-selector-hi"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi' ? 'bg-white text-govblue shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Ramesh Kumar / BKUMARASWAMY style profile from Design HTML */}
            <div className="flex items-center gap-3 border-l border-white/20 pl-4 hidden md:flex">
              <div className="text-right">
                <p className="text-xs font-bold text-white">B. KUMARASWAMY</p>
                <p className="text-[10px] text-orange-200">District: Warangal</p>
              </div>
              <div className="w-10 h-10 bg-govorange text-white rounded-full border-2 border-white flex items-center justify-center text-sm font-black shadow-inner">
                B
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm shrink-0" id="primary-navigation-tabs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-nowrap overflow-x-auto gap-1 py-1 select-none">
            
            <button
              id="main-tab-schemes"
              onClick={() => setActiveMainTab('schemes')}
              className={`px-5 py-3 md:py-4 font-bold font-sans text-xs md:text-sm flex items-center gap-2 transition-all whitespace-nowrap border-b-4 ${
                activeMainTab === 'schemes' 
                  ? 'bg-blue-50/70 text-govblue border-govblue' 
                  : 'text-slate-600 hover:text-govblue hover:bg-slate-50 border-transparent'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span>{language === 'te' ? 'సంక్షేమ పథకాలు' : language === 'hi' ? 'कल्याणकारी योजनाएं' : 'Welfare Schemes'}</span>
            </button>

            <button
              id="main-tab-projects"
              onClick={() => setActiveMainTab('projects')}
              className={`px-5 py-3 md:py-4 font-bold font-sans text-xs md:text-sm flex items-center gap-2 transition-all whitespace-nowrap border-b-4 ${
                activeMainTab === 'projects' 
                  ? 'bg-blue-50/70 text-govblue border-govblue' 
                  : 'text-slate-600 hover:text-govblue hover:bg-slate-50 border-transparent'
              }`}
            >
              <Landmark className="w-5 h-5" />
              <span>{language === 'te' ? 'ప్రజా పనుల పారదర్శకత' : language === 'hi' ? 'परियोजना पारदर्शिता' : 'Project Transparency'}</span>
            </button>

            <button
              id="main-tab-chatbot"
              onClick={() => setActiveMainTab('chatbot')}
              className={`px-5 py-3 md:py-4 font-bold font-sans text-xs md:text-sm flex items-center gap-2 transition-all whitespace-nowrap border-b-4 ${
                activeMainTab === 'chatbot' 
                  ? 'bg-blue-50/70 text-govblue border-govblue' 
                  : 'text-slate-600 hover:text-govblue hover:bg-slate-50 border-transparent'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>{language === 'te' ? 'జన సేవ AI చాట్‌బాట్' : language === 'hi' ? 'जन सेवा AI चैटबॉट' : 'Jan Seva AI Chatbot'}</span>
            </button>

            <button
              id="main-tab-admin"
              onClick={() => setActiveMainTab('admin')}
              className={`px-5 py-3 md:py-4 font-bold font-sans text-xs md:text-sm flex items-center gap-2 transition-all whitespace-nowrap border-b-4 ${
                activeMainTab === 'admin' 
                  ? 'bg-blue-50/70 text-govblue border-govblue' 
                  : 'text-slate-600 hover:text-govblue hover:bg-slate-50 border-transparent'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>{language === 'te' ? 'అధికారుల బోర్డు' : language === 'hi' ? 'अधिकारियों का बोर्ड' : 'Officer Hub'}</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="grow max-w-7xl mx-auto w-full px-4 md:px-6 py-6" id="app-main-content">
        
        {/* Render Active View */}
        {activeMainTab === 'schemes' && (
          <CitizenDashboard
            language={language}
            schemes={schemes}
            notifications={notifications}
            onUpdateNotifications={handleUpdateNotifications}
            bigTextMode={bigTextMode}
          />
        )}

        {activeMainTab === 'projects' && (
          <TransparencyModule
            language={language}
            projects={projects}
            bigTextMode={bigTextMode}
          />
        )}

        {activeMainTab === 'chatbot' && (
          <AIChatbot
            language={language}
          />
        )}

        {activeMainTab === 'admin' && (
          <AdminDashboard
            language={language}
            schemes={schemes}
            onAddScheme={handleAddScheme}
            onDeleteScheme={handleDeleteScheme}
            projects={projects}
            onAddProject={handleAddProject}
          />
        )}

      </main>

      {/* Footer Branding */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center border-t border-slate-800 font-sans text-xs shrink-0" id="main-app-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 National Digital Welfare Initiative • Digital India</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Transparency Protocol</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Accessibility Directives</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
