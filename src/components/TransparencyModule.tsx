import React, { useState } from 'react';
import { 
  Building2, MapPin, HardHat, FileText, Compass, AlertTriangle, 
  Layers, Search, ShieldAlert, BadgeInfo, HelpCircle, RefreshCw, 
  Droplets, Landmark, Activity, Sparkles, Sliders, CheckCircle2 
} from 'lucide-react';
import { Project, Language, ProjectCostFactors } from '../types';
import { getTranslation } from '../localization';

interface TransparencyModuleProps {
  language: Language;
  projects: Project[];
  bigTextMode: boolean;
}

export default function TransparencyModule({
  language,
  projects,
  bigTextMode,
}: TransparencyModuleProps) {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[1]); // Default to flagged Kurnool Highway for demo
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Calculator factors
  const [costFactors, setCostFactors] = useState<ProjectCostFactors>({
    lengthKm: 12,
    widthMeters: 14,
    floors: 2,
    beds: 15,
    classrooms: 18,
    materialQuality: 'standard',
    terrainType: 'plain'
  });

  const [calculationResult, setCalculationResult] = useState<{
    estimatedCost: number;
    deviationPercent: number;
    status: 'fair' | 'flagged' | 'low';
  }>({
    estimatedCost: 45.2, // in Crores
    deviationPercent: 88.0, // Kurnool reported budget 85Cr vs 45.2Cr estimate
    status: 'flagged'
  });

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    
    // Automatically configure default cost factor values based on selected project's metadata
    const length = project.category === 'Road' ? 12 : project.category === 'Water' ? 45 : 1;
    const classrooms = project.category === 'School' ? 18 : 0;
    const beds = project.category === 'Hospital' ? 15 : 0;

    const initialFactors: ProjectCostFactors = {
      lengthKm: length,
      widthMeters: project.category === 'Bridge' ? 12 : 14,
      floors: project.category === 'Hospital' || project.category === 'School' ? 2 : 1,
      beds: beds,
      classrooms: classrooms,
      materialQuality: 'standard',
      terrainType: project.id === 'proj_highway_bypass' ? 'hilly' : 'plain'
    };

    setCostFactors(initialFactors);
    recalculateCost(initialFactors, project.budget, project.category);
  };

  const handleFactorChange = (key: keyof ProjectCostFactors, value: any) => {
    const updated = { ...costFactors, [key]: value };
    setCostFactors(updated);
    recalculateCost(updated, selectedProject.budget, selectedProject.category);
  };

  const recalculateCost = (factors: ProjectCostFactors, reportedBudget: number, category: string) => {
    let estimatedCost = 0; // in Crores

    if (category === 'Road') {
      const basePerKm = factors.materialQuality === 'economy' ? 1.5 : factors.materialQuality === 'standard' ? 3.0 : 5.5;
      const terrainMult = factors.terrainType === 'hilly' ? 1.4 : factors.terrainType === 'marshy' ? 1.7 : 1.0;
      estimatedCost = (factors.lengthKm || 1) * basePerKm * terrainMult;
    } else if (category === 'Bridge') {
      const basePerMeter = factors.materialQuality === 'economy' ? 0.05 : factors.materialQuality === 'standard' ? 0.08 : 0.12;
      // bridge length simulated as 240m
      estimatedCost = 240 * basePerMeter;
    } else if (category === 'School') {
      const costPerClassroom = factors.materialQuality === 'economy' ? 0.15 : factors.materialQuality === 'standard' ? 0.25 : 0.45;
      estimatedCost = (factors.classrooms || 1) * costPerClassroom + 1.2; // base foundation infrastructure
    } else if (category === 'Hospital') {
      const costPerBed = factors.materialQuality === 'economy' ? 0.08 : factors.materialQuality === 'standard' ? 0.15 : 0.25;
      estimatedCost = (factors.beds || 1) * costPerBed * (factors.floors || 1) + 1.8; // medical gas/machinery baseline
    } else if (category === 'Water') {
      // 45km pipeline representation
      const pipeCostPerKm = factors.materialQuality === 'economy' ? 0.15 : factors.materialQuality === 'standard' ? 0.22 : 0.35;
      estimatedCost = (factors.lengthKm || 1) * pipeCostPerKm + 2.5; // reservoirs base
    }

    // Keep to 1 decimal place
    estimatedCost = parseFloat(estimatedCost.toFixed(1));

    // Calculate Deviation
    const deviation = reportedBudget - estimatedCost;
    const deviationPercent = parseFloat(((deviation / estimatedCost) * 100).toFixed(0));

    let status: 'fair' | 'flagged' | 'low' = 'fair';
    if (deviationPercent >= 30) {
      status = 'flagged';
    } else if (deviationPercent <= -15) {
      status = 'low';
    }

    setCalculationResult({
      estimatedCost,
      deviationPercent,
      status
    });
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.contractor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="transparency-module">
      
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
        <h2 className="font-sans font-extrabold text-slate-800 text-2xl">
          {getTranslation('infra_title', language)}
        </h2>
        <p className="text-slate-500 font-sans text-xs md:text-sm mt-1">
          {getTranslation('infra_subtitle', language)}
        </p>
      </div>

      {/* SVG District Interactive Grid and Project Details Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Side: Custom SVG Interactive Region Map & Projects List (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Custom District Interactive map */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left" id="regional-svg-map">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block mb-3">
              📍 {language === 'te' ? 'జిల్లా మ్యాప్ పారదర్శకత - క్లిక్ చేయండి' : 'District Project Hub Map (Click Glowing Pins)'}
            </span>

            {/* Simulated Geographic district layout using SVG */}
            <div className="relative w-full aspect-[4/3] bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden flex items-center justify-center">
              
              {/* Background abstract stylized state boundaries */}
              <svg className="absolute inset-0 w-full h-full text-slate-200/50" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,20 Q25,10 40,25 T70,15 T90,30 T85,60 T60,75 T30,65 T10,50 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                <path d="M40,25 Q50,45 60,35" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,1" />
                <path d="M30,65 Q45,50 60,75" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,1" />
              </svg>

              {/* Grid backdrop */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-30 pointer-events-none">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-slate-200 text-[6px] text-slate-400 font-mono p-1">
                    {i}
                  </div>
                ))}
              </div>

              {/* Interactive Glowing Pins for Projects */}
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  id={`map-pin-${proj.id}`}
                  onClick={() => handleSelectProject(proj)}
                  className="absolute group z-10"
                  style={{ top: `${proj.lat}%`, left: `${proj.lng}%` }}
                >
                  <span className="relative flex h-5 w-5">
                    {proj.flagged ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-600 border-2 border-white flex items-center justify-center shadow-lg">
                          <AlertTriangle className="w-2.5 h-2.5 text-white" />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </span>
                      </>
                    )}
                  </span>
                  {/* Hover tooltip */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                    {proj.title} (₹{proj.budget}Cr)
                  </div>
                </button>
              ))}

              <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 p-2 rounded-xl text-[10px] font-sans font-bold space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>{language === 'te' ? 'సవ్యంగా సాగుతున్న పనులు' : 'Verified Budget Projects'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>{language === 'te' ? 'అధిక బడ్జెట్ సందేహాస్పద పనులు' : 'Potential Overpricing Flags'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filter List of projects */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                📁 {language === 'te' ? 'ప్రజా పనుల జాబితా' : 'Infrastructure Registry'}
              </span>
              <select
                id="filter-category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-sans"
              >
                <option value="All">All Categories</option>
                <option value="Road">Roads</option>
                <option value="Bridge">Bridges</option>
                <option value="Hospital">Hospitals</option>
                <option value="School">Schools</option>
                <option value="Water">Water Systems</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  id={`project-row-${p.id}`}
                  onClick={() => handleSelectProject(p)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex justify-between items-center gap-3 ${
                    selectedProject.id === p.id 
                      ? 'bg-blue-50/70 border-govblue' 
                      : 'bg-slate-50/50 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate font-sans">
                      {language === 'te' ? p.titleLocal.te : language === 'hi' ? p.titleLocal.hi : p.title}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium font-sans">
                      {p.contractor} • {p.location}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-govblue font-mono">₹{p.budget} Cr</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      p.flagged ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.flagged ? 'Flagged' : 'Normal'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Project Inspector and Cost Estimator Auditor (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Active Project details inspector card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left space-y-4" id="project-inspector">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-1 bg-blue-50 text-govblue border border-blue-200/50 text-[10px] font-bold uppercase tracking-wider rounded-md font-sans">
                  {selectedProject.category} Infrastructure Work
                </span>
                <h3 className="font-sans font-extrabold text-slate-800 text-lg md:text-xl">
                  {language === 'te' ? selectedProject.titleLocal.te : language === 'hi' ? selectedProject.titleLocal.hi : selectedProject.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block font-sans font-semibold">Reported Budget</span>
                <span className="text-xl font-black text-govblue font-mono">₹{selectedProject.budget} Crore</span>
              </div>
            </div>

            {/* General progress & information layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{getTranslation('proj_contractor', language)}</span>
                <p className="text-xs font-bold text-slate-800 font-sans">{selectedProject.contractor}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{getTranslation('proj_completion', language)}</span>
                <div className="flex items-center gap-2">
                  <div className="grow bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedProject.completionPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 font-mono shrink-0">{selectedProject.completionPercent}%</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{getTranslation('proj_date', language)}</span>
                <p className="text-xs font-bold text-slate-800 font-mono">{selectedProject.expectedCompletionDate}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Project Specification details</span>
              <p className="text-slate-600 font-sans text-xs md:text-sm leading-relaxed">
                {language === 'te' ? selectedProject.detailsLocal.te : language === 'hi' ? selectedProject.detailsLocal.hi : selectedProject.details}
              </p>
            </div>

            {selectedProject.flagged && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3" id="deviation-alert-box">
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <h4 className="font-sans font-bold text-rose-800 text-sm">
                    {getTranslation('flagged_warning', language)}
                  </h4>
                  <p className="text-xs text-rose-700 leading-relaxed font-sans">
                    {language === 'te' ? selectedProject.flagReasonLocal?.te : language === 'hi' ? selectedProject.flagReasonLocal?.hi : selectedProject.flagReason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Construction Cost Estimation Auditor Tool */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left space-y-6" id="cost-estimator-tool">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-amber-50 p-2 rounded-xl text-amber-600">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-lg">
                  {getTranslation('proj_estimator_title', language)}
                </h3>
                <p className="text-slate-500 font-sans text-xs">
                  {getTranslation('proj_estimator_desc', language)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Controls Form */}
              <div className="space-y-4">
                <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
                  🔧 {language === 'te' ? 'ప్రాజెక్ట్ కొలతలను మార్చండి:' : 'Adjust Project Parameters:'}
                </span>

                {selectedProject.category === 'Road' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Total Road Length (Kilometers)</label>
                    <input
                      type="number"
                      id="cost-road-length"
                      value={costFactors.lengthKm}
                      onChange={(e) => handleFactorChange('lengthKm', parseFloat(e.target.value) || 1)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                      min="1"
                    />
                  </div>
                )}

                {selectedProject.category === 'School' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Number of Classrooms</label>
                    <input
                      type="number"
                      id="cost-classrooms"
                      value={costFactors.classrooms}
                      onChange={(e) => handleFactorChange('classrooms', parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                      min="1"
                    />
                  </div>
                )}

                {selectedProject.category === 'Hospital' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Number of Beds</label>
                      <input
                        type="number"
                        id="cost-hospital-beds"
                        value={costFactors.beds}
                        onChange={(e) => handleFactorChange('beds', parseInt(e.target.value) || 1)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                        min="1"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Floors Count</label>
                      <input
                        type="number"
                        id="cost-hospital-floors"
                        value={costFactors.floors}
                        onChange={(e) => handleFactorChange('floors', parseInt(e.target.value) || 1)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                        min="1"
                      />
                    </div>
                  </div>
                )}

                {selectedProject.category === 'Water' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Pipeline Network Length (Kilometers)</label>
                    <input
                      type="number"
                      id="cost-water-length"
                      value={costFactors.lengthKm}
                      onChange={(e) => handleFactorChange('lengthKm', parseFloat(e.target.value) || 1)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                      min="1"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Materials Quality</label>
                    <select
                      id="cost-materials"
                      value={costFactors.materialQuality}
                      onChange={(e) => handleFactorChange('materialQuality', e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold font-sans"
                    >
                      <option value="economy">Economy Grade</option>
                      <option value="standard">Standard Public Grade</option>
                      <option value="premium">Premium Durable Grade</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Terrain Type</label>
                    <select
                      id="cost-terrain"
                      value={costFactors.terrainType}
                      onChange={(e) => handleFactorChange('terrainType', e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold font-sans"
                    >
                      <option value="plain">Flat plain field</option>
                      <option value="hilly">Hilly terrain (+40% cost)</option>
                      <option value="marshy">Swampy / Marshy ground (+70% cost)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Cost Output Auditing Meter */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between" id="auditor-gauge">
                <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
                  📊 {language === 'te' ? 'స్వతంత్ర అంచనా నివేదిక:' : 'Audit Estimation Report:'}
                </span>

                <div className="py-4 space-y-4">
                  <div>
                    <span className="text-slate-500 font-sans text-xs block">Estimated Standard Market Cost:</span>
                    <span className="text-3xl font-black text-slate-800 font-mono">₹{calculationResult.estimatedCost} Crore</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-sans text-xs block">Budget Deviation vs Report:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-extrabold font-mono ${
                        calculationResult.deviationPercent >= 30 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {calculationResult.deviationPercent > 0 ? `+${calculationResult.deviationPercent}%` : `${calculationResult.deviationPercent}%`}
                      </span>
                      <span className="text-[10px] font-sans font-bold text-slate-400">
                        {calculationResult.deviationPercent > 0 ? 'Cost Excess' : 'Under Budget'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                  calculationResult.status === 'flagged' 
                    ? 'bg-rose-100 text-rose-800 border-rose-200' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`} id="estimator-status-badge">
                  {calculationResult.status === 'flagged' ? (
                    <>
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <span>{language === 'te' ? 'బడ్జెట్ అపరిమితంగా ఎక్కువగా ఉంది - పర్యవేక్షించండి' : 'FLAGGED: High Budget Variance Found'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>{language === 'te' ? 'బడ్జెట్ సమంజసంగా ఉంది' : 'FAIR: Budget conforms to standard averages'}</span>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Disclaimer Footer */}
            <p className="text-[10px] text-slate-400 leading-normal border-t border-slate-100 pt-3 flex items-start gap-1.5">
              <BadgeInfo className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{getTranslation('estimator_footer', language)}</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
