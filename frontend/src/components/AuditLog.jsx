import React from 'react';
import { CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';

const AuditLog = ({ scans, onAssetClick }) => {
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
              onClick={() => onAssetClick && onAssetClick(scan)}
              className={`p-3 rounded-lg border transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95 ${
                scan.is_consistent 
                  ? 'bg-green-500/5 border-green-500/10 hover:border-green-500/30' 
                  : 'bg-red-500/5 border-red-500/10 hover:border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
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
                    {scan.details.split(']')[0].replace('[', '')}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(scan.scanned_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 truncate pl-5 mb-1 italic">
                {scan.scanned_path}
              </p>
              <div className="flex items-center gap-1.5 pl-5 text-[9px] font-bold text-sl-accent/70 uppercase tracking-widest">
                <MapPin size={10} /> {scan.details.split(' - ')[0].split('] ')[1] || 'Unknown Location'}
              </div>
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
