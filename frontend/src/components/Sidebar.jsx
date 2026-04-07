import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Database, Settings, HelpCircle, LogOut, X, Package, Activity } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: '통합 관제 대시보드', path: '/' },
    { icon: <Package size={20} />, label: 'ERP 자산 등록', path: '/erp' },
    { icon: <Activity size={20} />, label: '엔진 및 규칙 관리', path: '/engine' },
  ];

  return (
    <aside className={`fixed lg:sticky top-0 left-0 z-50 w-64 md:w-72 max-w-[80vw] bg-[#0C0C0C] border-r border-sl-border flex flex-col p-6 h-screen transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="flex items-center justify-between gap-3 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-sl-accent p-2 rounded-lg shrink-0">
            <Shield className="text-zinc-900" size={24} />
          </div>
          <span className="text-xl font-satoshi font-bold tracking-tight text-white whitespace-nowrap">IntegrityCore</span>
        </div>
        <button 
          onClick={onClose} 
          className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-sl-muted shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 px-2">Main Navigation</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-medium group
              ${isActive 
                ? 'bg-sl-accent text-zinc-900 shadow-lg shadow-amber-500/20' 
                : 'text-sl-muted hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>


    </aside>
  );
};

export default Sidebar;
