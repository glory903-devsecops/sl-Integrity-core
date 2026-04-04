import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Save, ArrowRight, Activity } from 'lucide-react';

const ERPPage = ({ onOpenSidebar }) => {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    description: '',
    department: 'Smart Factory A'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('새로운 자산이 SDF 시스템에 등록되었습니다. (ERP 연동 성공)');
    setFormData({ name: '', path: '', description: '', department: 'Smart Factory A' });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onOpenSidebar}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-sl-accent"
          >
            <Activity size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-satoshi font-bold tracking-tight text-white mb-2">
              ERP Asset Registration
            </h1>
            <p className="text-sl-muted">
              에스엘(SL) 스마트 팩토리 전사적 자원 관리(ERP) 시스템 자산 등록 센터
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Form */}
        <div className="glass-panel p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
            <Plus className="text-sl-accent" size={20} />
            <h2 className="text-xl font-bold text-white font-satoshi">신규 전역 자산 등록</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-sl-muted uppercase tracking-widest px-1">자산 명칭 (Asset Name)</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="예: 공정 제어 단말 V3 / MES DB 서버" 
                className="w-full bg-black/40 border border-zinc-800 focus:border-sl-accent/50 p-3 rounded-lg text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-sl-muted uppercase tracking-widest px-1">대상 경로 (Absolute Path)</label>
              <input 
                type="text" 
                required 
                value={formData.path}
                onChange={(e) => setFormData({...formData, path: e.target.value})}
                placeholder="/opt/sl/smart_factory/control_code" 
                className="w-full bg-black/40 border border-zinc-800 focus:border-sl-accent/50 p-3 rounded-lg text-white font-jetbrains outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-sl-muted uppercase tracking-widest px-1">관리 부서</label>
                <select 
                  className="w-full bg-black/40 border border-zinc-800 focus:border-sl-accent/50 p-3 rounded-lg text-white outline-none transition-all"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option>Smart Factory A</option>
                  <option>Quality Control B</option>
                  <option>R&D Center</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-sl-muted uppercase tracking-widest px-1">보완 중요도</label>
                <select className="w-full bg-black/40 border border-zinc-800 focus:border-sl-accent/50 p-3 rounded-lg text-white outline-none transition-all">
                  <option>Critical (Grade S)</option>
                  <option>High (Grade A)</option>
                  <option>Medium (Grade B)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-sl-muted uppercase tracking-widest px-1">자산 설명</label>
              <textarea 
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="해당 자산의 용도 및 중요 파일 정보를 입력하세요."
                className="w-full bg-black/40 border border-zinc-800 focus:border-sl-accent/50 p-3 rounded-lg text-white outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-sl-accent hover:bg-amber-600 px-6 py-3.5 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-amber-500/10 text-zinc-900 group"
            >
              <Save size={20} />
              SDF 무결성 감시망 등록하기
              <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-zinc-800 bg-zinc-900/20">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-sl-accent" size={24} />
              <h3 className="text-lg font-bold text-white">ERP-to-SDF Sync Status</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">동기화 대기 자산</span>
                  <span className="text-sl-accent font-bold">12 개</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sl-accent h-full w-[65%]"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-center">
                  <p className="text-[10px] text-sl-muted uppercase tracking-widest mb-1">Weekly Added</p>
                  <p className="text-2xl font-bold text-white">45</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-center">
                  <p className="text-[10px] text-sl-muted uppercase tracking-widest mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-400">1,204</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">운영 프로세스 알림</h3>
            <ul className="space-y-3">
              {[
                'ERP에 등록된 자산은 즉시 SDF 무결성 감시망에 편입됩니다.',
                '최초 등록 시 1회 전수 해싱 스캔이 자동 실행됩니다.',
                '비인가된 경로가 등록될 경우 보안 팀에 즉각 통지됩니다.'
              ].map((text, i) => (
                <li key={i} className="flex gap-2 text-xs text-sl-muted leading-relaxed">
                  <span className="text-sl-accent">•</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPPage;
