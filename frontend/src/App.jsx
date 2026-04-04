import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import AssetTable from './components/AssetTable';
import IntegrityChart from './components/IntegrityChart';
import { ShieldCheck, ShieldAlert, Activity, Database, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [stats, setStats] = useState({ total_assets: 0, healthy_assets: 0, critical_issues: 0, total_scans: 0 });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, assetsRes] = await Promise.all([
        axios.get(`${API_BASE}/stats`),
        axios.get(`${API_BASE}/assets`)
      ]);
      setStats(statsRes.data);
      setAssets(assetsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleScanAll = async () => {
    setScanning(true);
    try {
      await axios.post(`${API_BASE}/scan-all`);
      setTimeout(fetchData, 2000);
    } catch (error) {
      console.error("Error scanning assets:", error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-sl-bg text-sl-text relative overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-sl-accent"
            >
              <Activity size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-satoshi font-bold tracking-tight text-white mb-1 md:mb-2">
                Factory Integrity Monitoring
              </h1>
            <p className="text-sl-muted">
              에스엘(SL) 스마트 제조 공장 자산 무결성 실시간 관제 시스템
            </p>
            </div>
          </div>
          
          <button 
            onClick={handleScanAll}
            disabled={scanning}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-sl-accent hover:bg-amber-600 px-6 py-2.5 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 text-zinc-900"
          >
            <RefreshCw size={20} className={scanning ? "animate-spin" : ""} />
            {scanning ? "검사 중..." : "전체 무결성 검사 실행"}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="총 관리 자산" 
            value={stats.total_assets} 
            icon={<Database className="text-blue-400" />} 
          />
          <StatCard 
            title="정상 가동 자산" 
            value={stats.healthy_assets} 
            icon={<ShieldCheck className="text-green-400" />} 
            trend="+2% vs last week"
          />
          <StatCard 
            title="무결성 위배 (임계)" 
            value={stats.critical_issues} 
            icon={<ShieldAlert className="text-red-400" />} 
            isCritical={stats.critical_issues > 0}
          />
          <StatCard 
            title="누적 검사 횟수" 
            value={stats.total_scans} 
            icon={<Activity className="text-purple-400" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-6 overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Database size={20} className="text-sl-accent" />
              자산 목록 및 상태
            </h2>
            <AssetTable assets={assets} onRefresh={fetchData} />
          </div>

          <div className="flex flex-col gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold mb-6">시스템 건강도 (SDF 인덱스)</h2>
              <IntegrityChart stats={stats} />
            </div>
            
            <div className="glass-panel p-6 border-l-4 border-l-sl-accent">
              <h3 className="font-bold font-satoshi mb-2">Security Notice</h3>
              <p className="text-sm text-sl-muted leading-relaxed">
                현재 모든 자산의 무결성이 해시 알고리즘(MD5/SHA256)을 통해 실시간으로 보호되고 있습니다. 
                임의의 파일 변경이 감지될 경우 즉시 경보가 발생합니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
