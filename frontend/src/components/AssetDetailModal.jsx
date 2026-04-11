import React from 'react';
import { X, Shield, AlertTriangle, CheckCircle2, FileText, MapPin, HardDrive, Cpu, Database, ShieldCheck } from 'lucide-react';

const AssetDetailModal = ({ asset, onClose }) => {
  if (!asset) return null;

  // Recovery Guidelines mapping based on category/department
  const getGuidelines = (dept) => {
    const defaultGuide = [
      "인사이트 포렌식 분석 실행 및 로그 보존.",
      "시스템 격리 및 관리 인원 외 접근 수동 차단.",
      "무결성 해시 알고리즘 재검증 및 정상 시점 복원."
    ];

    if (dept.includes("PLC")) return [
      "제어기 전원 인가 차단 및 네트워크 물리적 분리 로직 실행.",
      "공인 Baseline 펌웨어 서명 정합성 재검증 및 비교 분석.",
      "최신 무결성 해시값으로 펌웨어 복구 및 현장 시운전 수행."
    ];
    if (dept.includes("MES")) return [
      "구성 파일(config/db) 변경 내역 감사 로그 즉시 추출.",
      "승인된 관리자 인증 로그 및 외부 IP 접근 내역 대조.",
      "형상 관리 서버로부터 표준 설정값 강제 동기화(Restore)."
    ];
    if (dept.includes("R&D")) return [
      "해당 설계 도면 및 소스 코드 접근 권한 즉시 회수.",
      "DLP(데이터 유출 방지) 모듈 및 암호화 상태 전수 조사.",
      "프로젝트 전체 팀원의 보안 인증 토큰/키 갱신."
    ];
    if (dept.includes("데이터베이스") || dept.includes("DB")) return [
      "데이터베이스 트랜잭션 수동 정합성 체크 및 변조 시점 특정.",
      "안전하게 검증된 최신 백업 스냅샷(Archived)으로 Rollback.",
      "DB 엔진 무결성 패치 적용 및 감사 계정 비밀번호 변경."
    ];
    
    return defaultGuide;
  };

  const guidelines = getGuidelines(asset.department || '');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-3xl shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className={`p-6 flex justify-between items-center border-b border-white/5 ${
          asset.is_consistent ? 'bg-green-500/5' : 'bg-red-500/5'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${
              asset.is_consistent ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {asset.is_consistent ? <Shield size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{asset.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  asset.is_consistent ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {asset.is_consistent ? '정상 운용 중' : '무결성 위배 (Security Breach)'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">ID: {asset.id}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Asset Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-sl-muted mb-1 uppercase tracking-widest text-[9px] font-bold">
                <MapPin size={12} /> 물리적 위치 (Location)
              </div>
              <p className="text-zinc-100 font-semibold">{asset.location || '미지정'}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-sl-muted mb-1 uppercase tracking-widest text-[9px] font-bold">
                <Settings size={12} /> 관리 분류 (Category)
              </div>
              <p className="text-sl-accent font-bold uppercase text-sm">{asset.department}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sl-muted mb-1 uppercase tracking-widest text-[9px] font-bold">
              <FileText size={12} /> 모니터링 대상 경로 (Path)
            </div>
            <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 font-jetbrains text-xs text-zinc-400 break-all leading-relaxed">
              {asset.path}
            </div>
          </div>

          {/* Security Guidelines Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-sl-accent uppercase tracking-widest text-[10px] font-bold">
              <ShieldCheck size={14} /> 보안 대응 가이드라인 (Recovery Standard)
            </div>
            <div className="space-y-3">
              {guidelines.map((guide, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-sl-accent/5 border border-sl-accent/10 rounded-2xl">
                  <div className="bg-sl-accent/20 text-sl-accent w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-satoshi">
                    {guide}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-950/50 border-t border-white/5 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            닫기
          </button>
          {!asset.is_consistent && (
            <button 
              className="bg-sl-accent hover:bg-amber-600 text-zinc-900 px-6 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-amber-500/10"
            >
              긴급 복구 모드 가동
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetailModal;
