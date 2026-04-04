import React, { useState, useEffect, useRef } from 'react';
import { Settings, Terminal, ShieldCheck, Zap, AlertTriangle, Play, Pause, Activity, Edit3, Save, X, Info } from 'lucide-react';

const EnginePage = ({ onOpenSidebar }) => {
  const [rules, setRules] = useState([
    { id: 1, name: '핵심 OS 바이너리 보호', algo: 'SHA-256', freq: '실시간', depth: '전체 스캔', status: '활성화', desc: '시스템 부팅 및 커널 핵심 파일의 변조를 실시간 감시합니다.' },
    { id: 2, name: '공정 설정 파일 백업', algo: 'MD5', freq: '매시간', depth: '차분 스캔', status: '일시정지', desc: 'MES 및 설비 설정값의 변경 이력을 시간 단위로 추적합니다.' },
    { id: 3, name: 'PLC 펌웨어 베이스라인', algo: 'SHA-512', freq: '6시간', depth: '메타데이터', status: '활성화', desc: '제어 단말의 펌웨어 무결성을 주기적으로 검증합니다.' },
    { id: 4, name: 'MES 데이터베이스 스키마', algo: 'SHA-256', freq: '수동', depth: '스냅샷', status: '활성화', desc: 'DB 구조 및 중요 테이블의 비인가 변경을 탐지합니다.' }
  ]);

  const [editingRule, setEditingRule] = useState(null);
  const [logs, setLogs] = useState([
    { id: 1, time: '11:54:05', type: 'INFO', msg: '무결성 엔진 v3.2.0 초기화 완료.' },
    { id: 2, time: '11:54:08', type: 'SUCCESS', msg: '자산 저장소 연결 성공 (localhost:8000)' },
    { id: 3, time: '11:55:30', type: 'SCAN', msg: '백그라운드 주기적 스캔 시작 (주기: 10초)' }
  ]);
  const logEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
        type: Math.random() > 0.1 ? 'SCAN' : 'SUCCESS',
        msg: `무결성 검증 수행 중... [자산 ID: ${Math.floor(Math.random() * 50)}]`
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setRules(prev => prev.map(r => r.id === editingRule.id ? editingRule : r));
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
      type: 'INFO',
      msg: `정책 수정됨: ${editingRule.name} (설정 변경 적용 완료)`
    };
    setLogs(prev => [...prev.slice(-15), newLog]);
    setEditingRule(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
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
              엔진 및 탐지 규칙 관리
            </h1>
            <p className="text-sl-muted">
              실시간 자산 위변조 탐지 엔진 제어 및 정책 관리 (Clean Architecture v2)
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Rules Config Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel p-6 border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Settings className="text-sl-accent" size={20} />
                <h2 className="text-xl font-bold text-white font-satoshi">탐지 정책 리스트</h2>
              </div>
              <button className="flex items-center gap-2 text-xs bg-sl-accent/10 text-sl-accent px-4 py-2 rounded-lg border border-sl-accent/20 hover:bg-sl-accent hover:text-zinc-900 transition-all font-bold">
                <Zap size={14} /> 신규 정책 추가
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sl-muted text-[10px] uppercase tracking-widest border-b border-white/5">
                    <th className="pb-4 font-bold px-2">정책 명칭</th>
                    <th className="pb-4 font-bold px-2">검증 알고리즘</th>
                    <th className="pb-4 font-bold px-2">검사 주기</th>
                    <th className="pb-4 font-bold px-2">상태</th>
                    <th className="pb-4 font-bold px-2 text-right">설정</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="group hover:bg-white/5 transition-all">
                      <td className="py-4 px-2">
                        <div>
                          <p className="text-sm font-bold text-white">{rule.name}</p>
                          <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                            <Info size={10} /> {rule.desc}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-xs text-sl-muted font-jetbrains">{rule.algo}</td>
                      <td className="py-4 px-2 text-xs text-sl-muted">{rule.freq}</td>
                      <td className="py-4 px-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rule.status === '활성화' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => setEditingRule(rule)}
                          className="p-2 text-sl-muted hover:text-sl-accent hover:bg-sl-accent/10 rounded-lg transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Engine Monitor */}
        <div className="space-y-6">
          <div className="glass-panel border-zinc-800 flex flex-col h-[500px] bg-black">
            <div className="p-4 bg-zinc-900/50 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="text-zinc-500" size={16} />
                <span className="text-xs font-bold text-zinc-400 font-jetbrains tracking-tight uppercase">SDF_CORE_ENGINE_v3</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
              </div>
            </div>
            <div className="flex-1 p-4 font-jetbrains text-[11px] overflow-y-auto space-y-2 custom-scrollbar">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2.5 text-zinc-400 leading-relaxed">
                  <span className="text-zinc-600">[{log.time}]</span>
                  <span className={`${
                    log.type === 'ERROR' ? 'text-red-400' :
                    log.type === 'SUCCESS' ? 'text-green-400' :
                    log.type === 'SCAN' ? 'text-blue-400' : 
                    'text-zinc-300'
                  }`}>
                    {log.type}
                  </span>
                  <span className="opacity-90">{log.msg}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditingRule(null)}
          ></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white font-satoshi flex items-center gap-2">
                <Edit3 className="text-sl-accent" size={20} /> 정책 상세 수정
              </h2>
              <button 
                onClick={() => setEditingRule(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest px-1">정책 명칭</label>
                <input 
                  type="text" 
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                  className="w-full bg-black/40 border border-zinc-800 p-3 rounded-lg text-white font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest px-1">검증 알고리즘</label>
                  <select 
                    value={editingRule.algo}
                    onChange={(e) => setEditingRule({...editingRule, algo: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 p-3 rounded-lg text-white outline-none"
                  >
                    <option>SHA-256</option>
                    <option>SHA-512</option>
                    <option>MD5</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest px-1">검사 주기</label>
                  <select 
                    value={editingRule.freq}
                    onChange={(e) => setEditingRule({...editingRule, freq: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 p-3 rounded-lg text-white outline-none"
                  >
                    <option>실시간</option>
                    <option>매시간</option>
                    <option>6시간</option>
                    <option>수동</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-sl-muted uppercase tracking-widest px-1">정책 역할 설명</label>
                <textarea 
                  rows="3"
                  value={editingRule.desc}
                  onChange={(e) => setEditingRule({...editingRule, desc: e.target.value})}
                  className="w-full bg-black/40 border border-zinc-800 p-3 rounded-lg text-white text-xs outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-sl-accent hover:bg-amber-600 text-zinc-900 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save size={20} /> 변경 사항 저장
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnginePage;
