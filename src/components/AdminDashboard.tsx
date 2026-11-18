import React, { useState } from 'react';
import { 
  BarChart, Layers, Settings, FilePlus2, ListFilter, Plus, 
  Trash2, Landmark, CheckCircle, ShieldAlert, Users, TrendingUp, 
  Sparkles, Calendar, Coins, HardHat 
} from 'lucide-react';
import { Scheme, Project, Language } from '../types';

interface AdminDashboardProps {
  language: Language;
  schemes: Scheme[];
  onAddScheme: (scheme: Scheme) => void;
  onDeleteScheme: (id: string) => void;
  projects: Project[];
  onAddProject: (proj: Project) => void;
}

export default function AdminDashboard({
  language,
  schemes,
  onAddScheme,
  onDeleteScheme,
  projects,
  onAddProject,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'schemes' | 'projects'>('analytics');
  
  // Scheme form state
  const [newSchemeName, setNewSchemeName] = useState('');
  const [newSchemeDept, setNewSchemeDept] = useState('Department of Social Welfare');
  const [newSchemeBenefit, setNewSchemeBenefit] = useState('');
  const [newSchemeEligible, setNewSchemeEligible] = useState('');
  const [newSchemeMaxIncome, setNewSchemeMaxIncome] = useState(150000);
  const [newSchemeMinAge, setNewSchemeMinAge] = useState(18);
  const [newSchemeDeadline, setNewSchemeDeadline] = useState('2026-12-31');

  // Project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<'Road' | 'Bridge' | 'Hospital' | 'School' | 'Water'>('Road');
  const [newProjBudget, setNewProjBudget] = useState(5.5);
  const [newProjContractor, setNewProjContractor] = useState('');
  const [newProjLocation, setNewProjLocation] = useState('');
  const [newProjDetails, setNewProjDetails] = useState('');

  // Handle addition
  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchemeName || !newSchemeBenefit || !newSchemeEligible) return;

    const scheme: Scheme = {
      id: 'scheme_custom_' + Date.now(),
      name: newSchemeName,
      nameLocal: {
        te: `[తెలుగు] ${newSchemeName}`,
        hi: `[हिंदी] ${newSchemeName}`
      },
      department: newSchemeDept,
      benefit: newSchemeBenefit,
      benefitLocal: {
        te: `[తెలుగు లబ్ధి] ${newSchemeBenefit}`,
        hi: `[हिंदी लाभ] ${newSchemeBenefit}`
      },
      eligibility: newSchemeEligible,
      eligibilityLocal: {
        te: `[తెలుగు అర్హత] ${newSchemeEligible}`,
        hi: `[हिंदी पात्रता] ${newSchemeEligible}`
      },
      requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Bank Passbook'],
      applicationProcess: 'Submit applications at nearest Sachivalayam portal.',
      applicationProcessLocal: {
        te: 'స్థానిక సచివాలయంలో దరఖాస్తును సమర్పించండి.',
        hi: 'निकटतम सचिवालय में आवेदन पत्र जमा करें।'
      },
      deadline: newSchemeDeadline,
      minAge: newSchemeMinAge,
      maxIncome: newSchemeMaxIncome,
      allowedGender: ['all'],
      allowedCategory: ['All']
    };

    onAddScheme(scheme);
    
    // reset
    setNewSchemeName('');
    setNewSchemeBenefit('');
    setNewSchemeEligible('');
    alert("New Welfare Scheme Published successfully!");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjContractor || !newProjLocation) return;

    // Check if budget represents highly suspicious overpricing for mock flagged scenario
    const isSuspicious = newProjBudget > 15 && newProjCategory === 'School';

    const proj: Project = {
      id: 'proj_custom_' + Date.now(),
      title: newProjTitle,
      titleLocal: {
        te: `[తెలుగు] ${newProjTitle}`,
        hi: `[हिंदी] ${newProjTitle}`
      },
      category: newProjCategory,
      budget: newProjBudget,
      contractor: newProjContractor,
      location: newProjLocation,
      locationLocal: {
        te: `[తెలుగు] ${newProjLocation}`,
        hi: `[हिंदी] ${newProjLocation}`
      },
      completionPercent: 5,
      expectedCompletionDate: '2027-08-15',
      details: newProjDetails || 'Standard public infrastructure construction work authorized by local district administration.',
      detailsLocal: {
        te: `[తెలుగు] ${newProjDetails || 'మండల కార్యాలయం ద్వారా ప్రజా పనులు.'}`,
        hi: `[हिंदी] ${newProjDetails || 'सार्वजनिक निर्माण कार्य।'}`
      },
      lat: Math.floor(Math.random() * 50) + 20,
      lng: Math.floor(Math.random() * 50) + 20,
      flagged: isSuspicious,
      flagReason: isSuspicious ? "Budget of ₹" + newProjBudget + " Crore is disproportionate for a simple rural school building. Standard limits average ₹4.5 Crore." : undefined,
      estimatedCostRange: {
        min: parseFloat((newProjBudget * 0.7).toFixed(1)),
        max: parseFloat((newProjBudget * 0.85).toFixed(1))
      }
    };

    onAddProject(proj);
    
    // reset
    setNewProjTitle('');
    setNewProjContractor('');
    setNewProjLocation('');
    setNewProjDetails('');
    alert("New Public Infrastructure Project Registered successfully!");
  };

  return (
    <div className="space-y-6" id="admin-dashboard-panel">
      
      {/* Admin Title Bar */}
      <div className="bg-govblue text-white p-6 rounded-3xl text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-govorange shadow-md">
        <div>
          <h2 className="font-sans font-extrabold text-2xl flex items-center gap-2">
            <Settings className="w-7 h-7 text-orange-200 animate-spin" />
            <span>National Welfare Administration Hub</span>
          </h2>
          <p className="text-orange-100 font-sans text-xs md:text-sm mt-1">
            Publish welfare policies, verify infrastructure cost sheets, and audit regional engagement.
          </p>
        </div>
        
        {/* Officer Quick Tab Options */}
        <div className="flex bg-white/10 p-1 rounded-xl gap-1 border border-white/5">
          <button
            id="admin-tab-analytics"
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'analytics' ? 'bg-white text-govblue shadow-sm' : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Analytics Hub
          </button>
          <button
            id="admin-tab-schemes"
            onClick={() => setActiveSubTab('schemes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'schemes' ? 'bg-white text-govblue shadow-sm' : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Manage Schemes
          </button>
          <button
            id="admin-tab-projects"
            onClick={() => setActiveSubTab('projects')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'projects' ? 'bg-white text-govblue shadow-sm' : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Manage Projects
          </button>
        </div>
      </div>

      {/* Analytics dashboard view */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6 text-left" id="admin-analytics-view">
          
          {/* Bento Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold font-sans uppercase">Active Welfare Schemes</span>
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <p className="text-3xl font-black text-slate-800 font-mono">{schemes.length}</p>
              <p className="text-[10px] text-emerald-600 font-sans font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Direct Cash & Grain Delivery
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold font-sans uppercase">Infrastructure Works</span>
                <Landmark className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-black text-slate-800 font-mono">{projects.length}</p>
              <p className="text-[10px] text-slate-500 font-sans font-bold">
                Water grid, Schools, Highways
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold font-sans uppercase">Flagged Discrepancies</span>
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-3xl font-black text-rose-600 font-mono">
                {projects.filter(p => p.flagged).length}
              </p>
              <p className="text-[10px] text-rose-500 font-sans font-bold">
                Under independent cost review
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold font-sans uppercase">Total Budget Tracked</span>
                <Coins className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-slate-800 font-mono">
                ₹{projects.reduce((acc, p) => acc + p.budget, 0).toFixed(1)} Cr
              </p>
              <p className="text-[10px] text-emerald-600 font-sans font-bold">
                100% auditable on public ledger
              </p>
            </div>
          </div>

          {/* Graphical representation grid utilizing pure Tailwind visual charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart A: Scheme Popularity / Registrations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-sans font-bold text-slate-800 text-sm md:text-base">
                Welfare Scheme Matching Hits (Daily Visits)
              </h4>
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-sans font-bold text-slate-600 mb-1">
                    <span>Rythu Bharosa (Farmer Cash)</span>
                    <span>1,842 requests</span>
                  </div>
                  <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-sans font-bold text-slate-600 mb-1">
                    <span>YSR Pension Kanuka (Elderly)</span>
                    <span>1,402 requests</span>
                  </div>
                  <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-sans font-bold text-slate-600 mb-1">
                    <span>Amma Vodi (Mothers Support)</span>
                    <span>1,192 requests</span>
                  </div>
                  <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-[#128c7e] h-full rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-sans font-bold text-slate-600 mb-1">
                    <span>Vidya Deevena (Fee Refund)</span>
                    <span>720 requests</span>
                  </div>
                  <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart B: Regional Demographics Access distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-sans font-bold text-slate-800 text-sm md:text-base">
                Citizen Demographics Distribution Accessing Portal
              </h4>
              <div className="grid grid-cols-4 gap-4 pt-4 text-center h-48 items-end border-b border-slate-100 pb-2">
                <div className="space-y-2">
                  <div className="bg-blue-600 rounded-t-lg mx-auto w-10" style={{ height: '110px' }} />
                  <span className="text-[10px] font-bold text-slate-600 block">OBC (40%)</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-amber-500 rounded-t-lg mx-auto w-10" style={{ height: '70px' }} />
                  <span className="text-[10px] font-bold text-slate-600 block">SC (25%)</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-purple-500 rounded-t-lg mx-auto w-10" style={{ height: '45px' }} />
                  <span className="text-[10px] font-bold text-slate-600 block">ST (15%)</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-emerald-500 rounded-t-lg mx-auto w-10" style={{ height: '55px' }} />
                  <span className="text-[10px] font-bold text-slate-600 block">General (20%)</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-sans italic text-center">
                System tracking highlights ST/SC outreach ratios are up 24% month-over-month.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin SubTab: Welfare Schemes Manager */}
      {activeSubTab === 'schemes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left" id="admin-schemes-manager">
          
          {/* Creator Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
              <FilePlus2 className="w-5 h-5 text-blue-600" />
              Publish New Scheme
            </h4>

            <form className="space-y-4" onSubmit={handleCreateScheme}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Scheme Name (English)</label>
                <input
                  type="text"
                  id="admin-scheme-name"
                  value={newSchemeName}
                  onChange={(e) => setNewSchemeName(e.target.value)}
                  placeholder="e.g. PM Kisan Nidhi"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Administering Department</label>
                <select
                  id="admin-scheme-dept"
                  value={newSchemeDept}
                  onChange={(e) => setNewSchemeDept(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-sans"
                >
                  <option value="Department of Agriculture">Department of Agriculture</option>
                  <option value="Department of Higher Education">Department of Higher Education</option>
                  <option value="Department of Social Welfare">Department of Social Welfare</option>
                  <option value="Department of Health and Family Welfare">Department of Health & Family Welfare</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Welfare Benefit Details</label>
                <textarea
                  id="admin-scheme-benefit"
                  value={newSchemeBenefit}
                  onChange={(e) => setNewSchemeBenefit(e.target.value)}
                  placeholder="Describe direct money amount or facilities..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-sans h-20 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Eligibility Requirements summary</label>
                <input
                  type="text"
                  id="admin-scheme-eligible"
                  value={newSchemeEligible}
                  onChange={(e) => setNewSchemeEligible(e.target.value)}
                  placeholder="e.g. Farmers with less than 5 acres land"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Max Annual Income</label>
                  <input
                    type="number"
                    id="admin-scheme-income"
                    value={newSchemeMaxIncome}
                    onChange={(e) => setNewSchemeMaxIncome(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Deadline Date</label>
                  <input
                    type="date"
                    id="admin-scheme-deadline"
                    value={newSchemeDeadline}
                    onChange={(e) => setNewSchemeDeadline(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <button
                id="add-scheme-submit-btn"
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-xs border-b-4 border-blue-800 hover:bg-blue-700 active:border-b-0 transition-all font-sans"
              >
                Publish Policy
              </button>
            </form>
          </div>

          {/* List Manager (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">
              📋 Scheme Registry database
            </span>

            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  id={`admin-scheme-row-${scheme.id}`}
                  className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-start gap-4"
                >
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-sans">
                      {scheme.department}
                    </span>
                    <h5 className="font-sans font-bold text-slate-800 text-sm">
                      {scheme.name}
                    </h5>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      Benefits: {scheme.benefit}
                    </p>
                  </div>

                  <button
                    id={`delete-scheme-btn-${scheme.id}`}
                    onClick={() => {
                      if (confirm("Delete this scheme from the registry?")) {
                        onDeleteScheme(scheme.id);
                      }
                    }}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin SubTab: Public Projects Manager */}
      {activeSubTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left" id="admin-projects-manager">
          
          {/* Project Creator Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
              <FilePlus2 className="w-5 h-5 text-blue-600" />
              Register Public Work
            </h4>

            <form className="space-y-4" onSubmit={handleCreateProject}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Project Title (English)</label>
                <input
                  type="text"
                  id="admin-project-title"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Anantapur Bypass Phase-2"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Category</label>
                  <select
                    id="admin-project-cat"
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-sans"
                  >
                    <option value="Road">Roads / Highway</option>
                    <option value="Bridge">Bridge structure</option>
                    <option value="Hospital">Hospital ward</option>
                    <option value="School">School building</option>
                    <option value="Water">Water pipes & Grid</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Project Budget (Crores)</label>
                  <input
                    type="number"
                    id="admin-project-budget"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(parseFloat(e.target.value) || 1)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Contractor Company Name</label>
                <input
                  type="text"
                  id="admin-project-contractor"
                  value={newProjContractor}
                  onChange={(e) => setNewProjContractor(e.target.value)}
                  placeholder="e.g. GWS Infrastructure Ltd"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">District Location Details</label>
                <input
                  type="text"
                  id="admin-project-location"
                  value={newProjLocation}
                  onChange={(e) => setNewProjLocation(e.target.value)}
                  placeholder="e.g. Dharmavaram Mandal, Anantapur"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Technical Details Description</label>
                <textarea
                  id="admin-project-details"
                  value={newProjDetails}
                  onChange={(e) => setNewProjDetails(e.target.value)}
                  placeholder="Laying asphalt, floors, reservoirs specifications..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-sans h-20 resize-none"
                />
              </div>

              <button
                id="add-project-submit-btn"
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-xs border-b-4 border-blue-800 hover:bg-blue-700 active:border-b-0 transition-all font-sans"
              >
                Register Work Project
              </button>
            </form>
          </div>

          {/* Infrastructure Projects Registry list (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">
              📋 Infrastructure Works Ledgers
            </span>

            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  id={`admin-project-row-${proj.id}`}
                  className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-left"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="px-2 py-0.5 bg-slate-200/60 text-slate-600 text-[9px] font-bold uppercase tracking-wider rounded font-mono">
                        {proj.category}
                      </span>
                      <h5 className="font-sans font-bold text-slate-800 text-sm mt-1">
                        {proj.title}
                      </h5>
                      <p className="text-xs text-slate-500 font-sans">
                        Contractor: {proj.contractor} | Location: {proj.location}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-blue-700 font-mono">₹{proj.budget} Cr</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        proj.flagged ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {proj.flagged ? 'Cost Flagged' : 'Audit OK'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
