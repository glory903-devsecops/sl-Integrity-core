import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, RefreshCw, Search, Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const AssetTable = ({ assets, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleScan = async (assetId) => {
    try {
      await axios.post(`${API_BASE}/scan/${assetId}`);
      onRefresh();
    } catch (error) {
      console.error("Scan failed:", error);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedAssets = useMemo(() => {
    let filtered = [...assets];
    
    // 1. Filtering (Search)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(lowerSearch) || 
        asset.path.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [assets, searchTerm, sortConfig]);

  const handleDownloadCSV = () => {
    const headers = ['Asset Name', 'Path', 'Status', 'Last Check'];
    const rows = processedAssets.map(asset => [
      asset.name,
      asset.path,
      asset.is_consistent ? '정상 (Consistent)' : '변조됨 (Tampered)',
      asset.last_scanned_at ? new Date(asset.last_scanned_at).toLocaleString() : 'Never'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SL_Asset_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100 transition-opacity ml-1.5" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-sl-accent ml-1.5" /> 
      : <ChevronDown size={14} className="text-sl-accent ml-1.5" />;
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h2 className="text-sl-muted text-[10px] md:text-xs font-bold uppercase tracking-widest px-2">Industrial Asset List</h2>
        <div className="flex w-full md:w-auto items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sl-muted" size={16} />
            <input 
              type="text" 
              placeholder="자산명 또는 경로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-sl-accent/50 outline-none transition-all"
            />
          </div>
          {/* CSV Download Button */}
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-sl-accent/10 hover:bg-sl-accent/20 border border-sl-accent/30 text-sl-accent px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
          >
            <Download size={16} />
            <span className="hidden sm:inline">CSV 다운로드</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-sl-muted text-[10px] md:text-xs uppercase tracking-widest">
                <th 
                  className="px-4 py-2 font-semibold cursor-pointer group hover:text-white transition-colors select-none"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">Asset Name <SortIcon columnKey="name" /></div>
                </th>
                <th 
                  className="px-4 py-2 font-semibold cursor-pointer group hover:text-white transition-colors select-none"
                  onClick={() => requestSort('path')}
                >
                  <div className="flex items-center">Path <SortIcon columnKey="path" /></div>
                </th>
                <th 
                  className="px-4 py-2 font-semibold cursor-pointer group hover:text-white transition-colors select-none"
                  onClick={() => requestSort('is_consistent')}
                >
                  <div className="flex items-center">Status <SortIcon columnKey="is_consistent" /></div>
                </th>
                <th 
                  className="px-4 py-2 font-semibold cursor-pointer group hover:text-white transition-colors select-none"
                  onClick={() => requestSort('last_scanned_at')}
                >
                  <div className="flex items-center">Last Check <SortIcon columnKey="last_scanned_at" /></div>
                </th>
                <th className="px-4 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedAssets.length > 0 ? (
                processedAssets.map((asset) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center text-sl-muted text-sm italic">
                    일치하는 자산이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;
