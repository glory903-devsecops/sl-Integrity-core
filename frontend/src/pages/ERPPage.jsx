import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Save, ArrowRight, Activity, HelpCircle, Folder, X, ShieldCheck, Database, Cpu, HardDrive, CheckCircle2 } from 'lucide-react';

const ERPPage = ({ onOpenSidebar }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    description: '',
    department: 'Smart Factory A'
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showExplorer, setShowExplorer] = useState(false);
  const [currentDir, setCurrentDir] = useState(['Home']);
  const [showHelp, setShowHelp] = useState(false);

  const ASSET_TEMPLATES = [
    { id: 'plc', name: 'PLC 로직 컨트롤러', icon: <Cpu />, path: '/opt/sl/smart_factory/plc_control', desc: '제어 단말의 핵심 로직 및 펌웨어 보호' },
    { id: 'mes', name: 'MES 서버 설정', icon: <Database />, path: '/opt/sl/mes/config/db.config', desc: '공정 및 통합 관리 서버의 구성 파일' },
    { id: 'rnd', name: 'R&D 설계 보안', icon: <ShieldCheck />, path: '/opt/sl/rnd/blueprints', desc: '신기술 도면 및 핵심 소스 코드 자산' },
    { id: 'db', name: '백업 데이터베이스', icon: <HardDrive />, path: '/var/sl/backup/db_snapshots', desc: '주기적 공정 데이터 백업 아카이브' },
  ];

  const MOCK_FS = {
    'Home': ['opt', 'var', 'etc', 'usr', 'Users', 'ProgramData'],
    'opt': ['sl', 'docker', 'bin'],
    'sl': ['smart_factory', 'rnd', 'mes', 'edge_node'],
    'smart_factory': ['plc_control', 'hmi_data', 'logs'],
    'plc_control': ['logic_v2', 'firmware_stable', 'backup'],
    'mes': ['config', 'db', 'scripts'],
    'ProgramData': ['SL_Corp', 'Microsoft', 'NVIDIA'],
    'SL_Corp': ['MES', 'QualityControl', 'Logistics'],
    'MES': ['config', 'db.config', 'security_policy'],
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setFormData({ 
      ...formData, 
      name: template.name + " (" + new Date().toLocaleDateString() + ")",
      path: template.path 
    });
    setCurrentStep(2);
  };

  const handleFolderClick = (folder) => {
    if (MOCK_FS[folder]) {
      setCurrentDir([...currentDir, folder]);
    } else {
      const fullPath = currentDir.join('/') + '/' + folder;
      setFormData({ ...formData, path: fullPath.replace('Home/', '/') });
    }
  };

  const goBack = () => {
    if (currentDir.length > 1) {
      setCurrentDir(currentDir.slice(0, -1));
    }
  };

  const handleSelectPath = () => {
    const fullPath = currentDir.join('/').replace('Home', '');
    setFormData({ ...formData, path: fullPath || '/' });
    setShowExplorer(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Backend registration failed");
      
      const result = await response.json();
      console.log("ERP Asset Registered:", result);
      alert("✅ 자산이 성공적으로 ERP 시스템 및 무결성 엔진에 등록되었습니다.");
      
      // Reset wizard
      setCurrentStep(1);
      setFormData({ name: '', path: '', description: '', department: 'Smart Factory A' });
      setSelectedTemplate(null);
    } catch (error) {
      console.error(error);
      alert("❌ 자산 등록 중 오류가 발생했습니다. 백엔드 상태를 확인하세요.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-sl-accent">
            <Activity size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-satoshi font-bold tracking-tight text-white mb-2">ERP 자산 등록 위저드</h1>
            <p className="text-sl-muted">스마트 제조 자산을 체계적으로 등록하고 보안 무결성 보호 대상으로 지정하세요.</p>
          </div>
        </div>
      </header>

      {/* Stepper Progress Indicator */}
      <div className="flex items-center max-w-xl mx-auto mb-12">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`flex flex-col items-center relative z-10`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep >= step ? 'bg-sl-accent text-zinc-900 shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
              }`}>
                {currentStep > step ? <CheckCircle2 size={20} /> : step}
              </div>
              <span className={`absolute -bottom-6 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${currentStep >= step ? 'text-sl-accent' : 'text-zinc-600'}`}>
                {step === 1 ? '자산 유형' : step === 2 ? '경로 지정' : '최종 확인'}
              </span>
            </div>
            {step < 3 && (
              <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${currentStep > step ? 'bg-sl-accent' : 'bg-zinc-800'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-8 border-zinc-800/80 min-h-[400px] flex flex-col">
          
          {/* STEP 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 flex-1">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">어떤 자산을 보호하시겠습니까?</h2>
                <p className="text-xs text-sl-muted">에스엘 표준 가이드를 기반으로 자산 유형을 선택해 주세요.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ASSET_TEMPLATES.map((tpl) => (
                  <button 
                    key={tpl.id}
                    onClick={() => handleTemplateSelect(tpl)}
                    className="group relative flex items-start gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-sl-accent/10 hover:border-sl-accent/30 transition-all text-left"
                  >
                    <div className="bg-zinc-900 p-3 rounded-xl text-sl-accent group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      {React.cloneElement(tpl.icon, { size: 24 })}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1 group-hover:text-sl-accent transition-colors">{tpl.name}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">{tpl.desc}</p>
                    </div>
                    <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sl-accent" size={20} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Path Selection */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 flex-1">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-8">
                <button onClick={() => setCurrentStep(1)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <ArrowRight className="rotate-180" size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">자산 위치 지정</h2>
                  <p className="text-[10px] text-sl-accent font-bold uppercase mt-0.5">Selected: {ASSET_TEMPLATES.find(t=>t.id===selectedTemplate)?.name}</p>
                </div>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest">대상 경로 (Absolute Path)</label>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">추천 경로 정합성 99%</span>
                      <button onMouseEnter={()=>setShowHelp(true)} onMouseLeave={()=>setShowHelp(false)} className="text-sl-accent/60 hover:text-sl-accent transition-colors">
                        <HelpCircle size={14} />
                      </button>
                    </div>
                  </div>

                  {showHelp && (
                    <div className="absolute right-0 -top-20 w-64 bg-zinc-800 border border-sl-accent/30 p-3 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                       <p className="text-[10px] text-zinc-300 leading-relaxed">
                        <span className="text-white font-bold">Tip:</span> 에스엘 표준 설치 가이드에 따라 기본 경로가 자동 입력되었습니다. 실제 서버 환경이 다르다면 탐색기를 사용해 주세요.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.path}
                      onChange={(e) => setFormData({...formData, path: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-sl-accent/50 p-4 rounded-xl text-white font-jetbrains outline-none transition-all shadow-inner"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowExplorer(true)}
                      className="bg-zinc-800 border border-zinc-700 text-sl-accent p-4 rounded-xl hover:border-sl-accent/50 transition-all font-bold group"
                    >
                      <Search size={22} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="bg-sl-accent/5 border border-sl-accent/10 p-4 rounded-xl flex items-start gap-4">
                  <Info size={20} className="text-sl-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    선택하신 <span className="text-sl-accent font-bold">{ASSET_TEMPLATES.find(t=>t.id===selectedTemplate)?.name}</span> 자산은 일반적으로 
                    관리 부서에서 직접 관리하는 <span className="text-white">절대 경로</span>를 입력해야 합니다. 
                    시스템 탐색기를 통해 실제 디렉토리를 탐색하고 선택하실 수 있습니다.
                  </p>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="w-full bg-sl-accent hover:bg-amber-600 text-zinc-900 font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    다음 단계로 이동 <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Metadata & Confirmation */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500 flex-1">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-8">
                <button type="button" onClick={() => setCurrentStep(2)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <ArrowRight className="rotate-180" size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">자산 최종 정보 입력</h2>
                  <p className="text-[10px] text-sl-muted uppercase font-bold mt-0.5 font-jetbrains tracking-widest">{formData.path}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest px-1">자산 식별 명칭</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-sl-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest px-1">담당 관리 부서</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-sl-accent/50 appearance-none"
                  >
                    <option>Smart Factory A</option>
                    <option>Smart Factory B</option>
                    <option>Quality Control B</option>
                    <option>R&D Center</option>
                    <option>IT Infrastructure</option>
                  </select>
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest px-1">상세 자산 설명</label>
                  <textarea 
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="해당 자산의 용도나 특이사항을 입력하세요..."
                    className="w-full bg-black/40 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-sl-accent/50 resize-none h-32"
                  ></textarea>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-sl-accent hover:bg-amber-600 text-zinc-900 font-bold py-5 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
                >
                  <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  최종 자산 등록 완료 (ERP Sync)
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Explorer Modal (Existing Component logic) */}
      {showExplorer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowExplorer(false)}></div>
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300 border-white/5">
            <div className="p-6 bg-zinc-800/40 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="bg-sl-accent text-zinc-900 p-2.5 rounded-xl">
                  <Search size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-satoshi uppercase tracking-tight">System Path Explorer</h2>
                  <div className="flex items-center gap-1 text-[10px] text-sl-muted font-jetbrains mt-1 bg-black/30 px-2 py-0.5 rounded-full">
                    {currentDir.map((dir, i) => (
                      <React.Fragment key={i}>
                        <span className="hover:text-sl-accent cursor-pointer transition-colors" onClick={() => setCurrentDir(currentDir.slice(0, i + 1))}>{dir}</span>
                        {i < currentDir.length - 1 && <span className="opacity-30 mx-1">/</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowExplorer(false)} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 h-[360px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentDir.length > 1 && (
                  <button 
                    onClick={goBack}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left"
                  >
                    <div className="text-zinc-500 group-hover:scale-110 transition-transform"><ArrowRight className="rotate-180" size={20} /></div>
                    <span className="text-xs font-bold text-zinc-400">상위 폴더</span>
                  </button>
                )}
                {(MOCK_FS[currentDir[currentDir.length - 1]] || []).map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleFolderClick(item)}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-zinc-800/50 rounded-2xl hover:bg-sl-accent/10 hover:border-sl-accent/30 transition-all text-left group"
                  >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {MOCK_FS[item] ? (
                        <Folder className="text-amber-500" size={22} fill="currentColor" fillOpacity={0.2} />
                      ) : (
                        <Activity className="text-sl-accent" size={22} />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-sl-accent transition-colors truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-zinc-950/50 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[11px] font-jetbrains text-center md:text-left">
                <span className="text-zinc-600">Current Selection:</span><br/>
                <span className="text-sl-accent font-bold">{currentDir.join('/').replace('Home', '') || '/'}</span>
              </div>
              <button 
                onClick={handleSelectPath}
                className="bg-sl-accent hover:bg-amber-600 text-zinc-900 px-8 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-amber-500/10"
              >
                가상 디렉토리 선택 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Added Info icon for helper */
const Info = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);

export default ERPPage;
