import React from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const AuditLog = ({ scans }) => {
  return (
    <div className="glass-panel h-80 flex flex-col border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-sl-accent" size={16} />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Real-time Integrity Audit</h3>
        </div>
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
        {scans && scans.length > 0 ? (
          scans.map((scan, idx) => (
            <div 
              key={scan.id || idx} 
              className={`p-3 rounded-lg border transition-all ${
                scan.is_consistent 
                  ? 'bg-green-500/5 border-green-500/10 hover:border-green-500/30' 
                  : 'bg-red-500/5 border-red-500/10 hover:border-red-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  {scan.is_consistent ? (
                    <CheckCircle2 className="text-green-500" size={14} />
                  ) : (
                    <AlertCircle className="text-red-500" size={14} />
                  )}
                  <span className="text-xs font-bold text-zinc-200">
                    {scan.scanned_path.split('/').pop()}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(scan.scanned_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate pl-5">
                {scan.details}
              </p>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-600 italic text-xs">
            No recent activity logged.
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
