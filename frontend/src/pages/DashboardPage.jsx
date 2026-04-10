import React, { useState, useEffect } from 'react';
import { Activity, Shield, Database, AlertCircle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import AssetTable from '../components/AssetTable';
import IntegrityChart from '../components/IntegrityChart';
import DepartmentChart from '../components/DepartmentChart';
import AuditLog from '../components/AuditLog';

const API_BASE_URL = 'http://localhost:8000/api';

const DashboardPage = ({ onOpenSidebar }) => {
  const [stats, setStats] = useState({
    total_assets: 0,
    healthy_assets: 0,
    critical_issues: 0,
    total_scans: 0,
    department_stats: {},
    recent_scans: []
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
        total_assets: 327,
        healthy_assets: 307,
        critical_issues: 20,
        total_scans: 5842,
        department_stats: {
          "PLC": { "total": 120, "healthy": 115 },
          "Robot": { "total": 85, "healthy": 78 },
          "CNC": { "total": 62, "healthy": 58 },
          "Sensor": { "total": 60, "healthy": 56 }
        },
        recent_scans: [
          { id: 1, scanned_path: "/opt/sf/nodes/ulsan/plc_logic", is_consistent: false, scanned_at: new Date().toISOString(), details: "Unauthorized binary modification detected." },
          { id: 2, scanned_path: "/opt/sf/nodes/gumi/vision/sensor_calib.dat", is_consistent: true, scanned_at: new Date().toISOString(), details: "Integrity check passed (SHA-256 matched)." }
        ]
      });
      // Realistic fallback assets for demo environments (e.g. GitHub Pages)
      setAssets([
        { id: 1001, name: "Siemens-S7-1500-001", path: "/opt/sf/nodes/ulsan/plc_logic/main_logic.bin", is_consistent: true, department: "PLC", last_scanned_at: new Date().toISOString() },
        { id: 1002, name: "ABB-IRB-6700-042", path: "/opt/sf/nodes/ulsan/robotics/arm_control.exe", is_consistent: false, department: "Robot", last_scanned_at: new Date().toISOString() },
        { id: 1003, name: "Mazak-Integrex-v2-015", path: "/opt/sf/nodes/changwon/cnc/tooling.cfg", is_consistent: true, department: "CNC", last_scanned_at: new Date().toISOString() },
        { id: 1004, name: "Keyence-CV-X-088", path: "/opt/sf/nodes/gumi/vision/sensor_calib.dat", is_consistent: true, department: "Sensor", last_scanned_at: new Date().toISOString() },
        { id: 1005, name: "Industrial PLC Logic", path: "/opt/sf/nodes/ulsan/plc_logic", is_consistent: false, department: "Smart Factory A", last_scanned_at: new Date().toISOString() },
        { id: 1006, name: "Fanuc-R-2000iD-112", path: "/opt/sf/nodes/whasung/robotics/sequence.bin", is_consistent: true, department: "Robot", last_scanned_at: new Date().toISOString() },
        { id: 1007, name: "DMG-Mori-CTX-003", path: "/opt/sf/nodes/changwon/cnc/spindle.cfg", is_consistent: true, department: "CNC", last_scanned_at: new Date().toISOString() },
        { id: 1008, name: "Omron-ZW-7000-056", path: "/opt/sf/nodes/gumi/vision/depth_map.bin", is_consistent: true, department: "Sensor", last_scanned_at: new Date().toISOString() },
        { id: 1009, name: "Daifuku-RGV-Mk3-009", path: "/opt/sf/nodes/ulsan/logistics/route.cfg", is_consistent: true, department: "Logistics", last_scanned_at: new Date().toISOString() },
        { id: 1010, name: "HVAC-System-P1-001", path: "/opt/sf/nodes/pyeongtaek/infra/hvac_ctrl.log", is_consistent: true, department: "Infrastructure", last_scanned_at: new Date().toISOString() }
      ]);
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-sl-accent" size={20} />
              <h2 className="text-xl font-bold text-white font-satoshi">전체 무결성 지수</h2>
            </div>
            <IntegrityChart stats={stats} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-sl-accent" size={20} />
              <h2 className="text-sm font-bold text-white font-satoshi uppercase tracking-wider">부서별 보안 상태</h2>
            </div>
            <div className="glass-panel p-4 border-zinc-800">
              <DepartmentChart deptStats={stats.department_stats} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-sl-accent" size={20} />
              <h2 className="text-sm font-bold text-white font-satoshi uppercase tracking-wider">실시간 보안 감사 (Audit)</h2>
            </div>
            <AuditLog scans={stats.recent_scans} />
          </div>
          
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
