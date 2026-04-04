import { Shield, LayoutDashboard, Database, Settings, HelpCircle, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`fixed lg:sticky top-0 left-0 z-50 w-72 bg-[#0C0C0C] border-r border-sl-border flex flex-col p-6 h-screen transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="flex items-center justify-between gap-3 mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-sl-accent p-2 rounded-lg">
            <Shield className="text-zinc-900" size={24} />
          </div>
          <span className="text-xl font-satoshi font-bold tracking-tight text-white">IntegrityCore</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-sl-muted">
          <X size={20} />
        </button>
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
      ? 'bg-amber-500/10 text-sl-accent border border-amber-500/20' 
      : 'text-sl-muted hover:bg-white/5 hover:text-white'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default Sidebar;
