import React from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const AssetTable = ({ assets, onRefresh }) => {
  const handleScan = async (assetId) => {
    try {
      await axios.post(`${API_BASE}/scan/${assetId}`);
      onRefresh();
    } catch (error) {
      console.error("Scan failed:", error);
    }
  };

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full align-middle px-4 md:px-0">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-sl-muted text-[10px] md:text-xs uppercase tracking-widest">
              <th className="px-4 py-2 font-semibold">Asset Name</th>
              <th className="px-4 py-2 font-semibold">Path</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Last Check</th>
              <th className="px-4 py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="bg-white/5 hover:bg-white/10 transition-colors group">
                <td className="px-3 md:px-4 py-4 rounded-l-xl font-medium text-sm md:text-base whitespace-nowrap">{asset.name}</td>
                <td className="px-3 md:px-4 py-4 text-sl-muted text-xs md:text-sm font-jetbrains truncate max-w-[120px] md:max-w-[200px]">
                  {asset.path}
                </td>
                <td className="px-3 md:px-4 py-4 whitespace-nowrap">
                  {asset.is_consistent ? (
                    <span className="flex items-center gap-1.5 text-green-400 text-[10px] md:text-sm font-semibold bg-green-400/10 px-2 md:px-3 py-1 rounded-full w-fit">
                      <CheckCircle2 size={14} className="md:w-4 md:h-4" /> 정상
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-400 text-[10px] md:text-sm font-semibold bg-red-400/10 px-2 md:px-3 py-1 rounded-full w-fit animate-pulse">
                      <XCircle size={14} className="md:w-4 md:h-4" /> 변조됨
                    </span>
                  )}
                </td>
                <td className="px-3 md:px-4 py-4 text-sl-muted text-[10px] md:text-sm whitespace-nowrap">
                  {asset.last_scanned_at ? new Date(asset.last_scanned_at).toLocaleString() : 'Never'}
                </td>
                <td className="px-3 md:px-4 py-4 rounded-r-xl text-right">
                  <button 
                    onClick={() => handleScan(asset.id)}
                    className="p-2 hover:bg-sl-accent/20 rounded-lg transition-colors text-sl-muted hover:text-sl-accent group-hover:scale-110 active:scale-95"
                    title="자산 스캔"
                  >
                    <RefreshCw size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;
