import React, { useState, useEffect, useRef } from 'react';
import { Settings, Terminal, ShieldCheck, Zap, AlertTriangle, Play, Pause, Activity } from 'lucide-react';

const EnginePage = ({ onOpenSidebar }) => {
  const [logs, setLogs] = useState([
    { id: 1, time: '11:24:05', type: 'INFO', msg: 'SDF Integrity Engine v3.2.0 initialized.' },
    { id: 2, time: '11:24:08', type: 'SUCCESS', msg: 'Connected to Asset Repository @ localhost:8000' },
    { id: 3, time: '11:25:30', type: 'SCAN', msg: 'Periodic background scan initiated (Interval: 10s)' }
  ]);
  const logEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
        type: Math.random() > 0.1 ? 'SCAN' : 'SUCCESS',
        msg: `자산 무결성 검증 수행 중... [Asset ID: ${Math.floor(Math.random() * 50)}]`
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

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
              Integrity Engine & Rules
            </h1>
            <p className="text-sl-muted">
              실시간 자산 위변조 탐지 엔진 제어 및 무결성 검증 규칙 관리
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Rules Config */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel p-6 border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Settings className="text-sl-accent" size={20} />
                <h2 className="text-xl font-bold text-white font-satoshi">탐지 엔진 정책 설정</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-sl-accent/10 text-sl-accent rounded hover:bg-sl-accent text-zinc-900 transition-colors">
                  <Play size={18} fill="currentColor" />
                </button>
                <button className="p-2 bg-white/5 text-sl-muted rounded hover:bg-white/10 transition-colors">
                  <Pause size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sl-muted text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">
                    <th className="pb-4 font-semibold px-2">Policy Name</th>
                    <th className="pb-4 font-semibold px-2">Algorithm</th>
                    <th className="pb-4 font-semibold px-2">Frequency</th>
                    <th className="pb-4 font-semibold px-2">Depth</th>
                    <th className="pb-4 font-semibold px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: 'Core OS Binary Protection', algo: 'SHA-256', freq: 'Real-time', depth: 'Full', status: 'ACTIVE' },
                    { name: 'Factory Config Backup', algo: 'MD5', freq: 'Hourly', depth: 'Diff', status: 'PAUSED' },
                    { name: 'PLC Firmware Baseline', algo: 'SHA-512', freq: '6 Hours', depth: 'Metadata', status: 'ACTIVE' },
                    { name: 'MES Database Schema', algo: 'SHA-256', freq: 'Manual', depth: 'Snapshot', status: 'ACTIVE' }
                  ].map((rule, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 text-sm font-medium text-white px-2 whitespace-nowrap">{rule.name}</td>
                      <td className="py-4 text-xs text-sl-muted font-jetbrains px-2">{rule.algo}</td>
                      <td className="py-4 text-xs text-sl-muted px-2">{rule.freq}</td>
                      <td className="py-4 text-xs text-sl-muted px-2">{rule.depth}</td>
                      <td className="py-4 text-right px-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rule.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400' : 'bg-zinc-800 text-sl-muted'}`}>
                          {rule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-6 w-full py-2 border border-dashed border-zinc-700 text-sl-muted text-sm hover:border-sl-accent/50 hover:text-sl-accent transition-all rounded-lg">
              + 신규 탐지 정책 추가
            </button>
          </div>
        </div>

        {/* Engine Monitor */}
        <div className="space-y-6">
          <div className="glass-panel border-zinc-800 flex flex-col h-[500px] bg-black">
            <div className="p-4 bg-zinc-900 flex justify-between items-center border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="text-zinc-500" size={16} />
                <span className="text-xs font-bold text-zinc-400 font-jetbrains tracking-tight">SDF_ENGINE_CLI v3.2</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
            </div>
            
            <div className="flex-1 p-4 font-jetbrains text-xs overflow-y-auto space-y-2 custom-scrollbar scroll-smooth">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-zinc-300 leading-relaxed">
                  <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                  <span className={`shrink-0 ${
                    log.type === 'ERROR' ? 'text-red-400' :
                    log.type === 'SUCCESS' ? 'text-green-400' :
                    log.type === 'SCAN' ? 'text-blue-400' : 
                    'text-zinc-500'
                  }`}>
                    {log.type}
                  </span>
                  <span className="opacity-90">{log.msg}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
            
            <div className="p-3 border-t border-white/5 bg-zinc-900/50 flex items-center gap-2 text-sl-muted italic text-[10px] shrink-0">
              <Zap size={12} className="text-sl-accent animate-pulse" />
              Real-time hashing engine scanning 124 assets...
            </div>
          </div>

          <div className="glass-panel p-6 border-zinc-800 flex items-center gap-4 group cursor-pointer hover:border-sl-accent/30 transition-all">
            <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-sl-muted uppercase tracking-widest font-bold">Latest Alert</p>
              <p className="text-sm text-white font-medium">Critical change in PLC_01 firmware</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnginePage;
