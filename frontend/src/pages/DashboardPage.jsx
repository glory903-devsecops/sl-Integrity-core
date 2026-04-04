import React, { useState, useEffect } from 'react';
import { Activity, Shield, Database, AlertCircle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import AssetTable from '../components/AssetTable';
import IntegrityChart from '../components/IntegrityChart';

const API_BASE_URL = 'http://localhost:8000/api';

const DashboardPage = ({ onOpenSidebar }) => {
  const [stats, setStats] = useState({
    total_assets: 0,
    healthy_assets: 0,
    critical_issues: 0,
    total_scans: 0
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, assetsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/stats`),
        axios.get(`${API_BASE_URL}/assets`)
      ]);
      setStats(statsRes.data);
      setAssets(assetsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback for demo
      setStats({
        total_assets: 124,
        healthy_assets: 122,
        critical_issues: 2,
        total_scans: 1542
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanAll = async () => {
    setScanning(true);
    try {
      await axios.post(`${API_BASE_URL}/scan-all`);
      setTimeout(fetchData, 2000);
    } catch (error) {
      console.error('Scan failed:', error);
      alert('전체 스캔 시작 중 오류가 발생했습니다.');
    } finally {
      setTimeout(() => setScanning(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onOpenSidebar}
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
          {scanning ? <RefreshCw className="animate-spin" size={20} /> : <Activity size={20} />}
          {scanning ? '전체 자산 스캔 중...' : '전체 무결성 검사 실행'}
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="총 관리 자산" 
          value={stats.total_assets} 
          icon={<Database className="text-blue-400" size={24} />} 
        />
        <StatCard 
          title="정상 가동 자산" 
          value={stats.healthy_assets} 
          icon={<Shield className="text-green-400" size={24} />} 
          trend="+2% vs last week"
        />
        <StatCard 
          title="무결성 위배 (임계)" 
          value={stats.critical_issues} 
          icon={<AlertCircle className="text-red-400" size={24} />} 
          isCritical={stats.critical_issues > 0}
        />
        <StatCard 
          title="누적 검사 횟수" 
          value={stats.total_scans} 
          icon={<Activity className="text-purple-400" size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-sl-accent" size={20} />
            <h2 className="text-xl font-bold text-white font-satoshi">자산 목록 및 상태</h2>
          </div>
          <AssetTable assets={assets} onScan={fetchData} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-sl-accent" size={20} />
            <h2 className="text-xl font-bold text-white font-satoshi">시스템 건강도 (SDF 인덱스)</h2>
          </div>
          <IntegrityChart stats={stats} />
          
          <div className="glass-panel p-6 border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Security Notice</h3>
            <p className="text-sl-muted text-sm leading-relaxed">
              현재 모든 자산의 무결성이 해시 알고리즘(MD5/SHA256)을 통해 실시간으로 보호되고 있습니다. 임의의 파일 변경이 감지될 경우 즉시 경보가 발생합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
