import React from 'react';
import { Shield, LayoutDashboard, Database, Settings, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col p-6 h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-sl-accent p-2 rounded-lg">
          <Shield className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">IntegrityCore</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="대시보드" active />
        <NavItem icon={<Database size={20} />} label="자산 관리" />
        <NavItem icon={<Settings size={20} />} label="시스템 설정" />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
        <NavItem icon={<HelpCircle size={20} />} label="도움말" />
        <NavItem icon={<LogOut size={20} />} label="로그아웃" />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active 
      ? 'bg-blue-500/10 text-sl-accent border border-blue-500/20' 
      : 'text-sl-muted hover:bg-white/5 hover:text-white'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default Sidebar;
