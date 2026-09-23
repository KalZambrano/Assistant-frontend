import React from 'react';
import {
  LayoutDashboard,
  Mail,
  Users,
  Calendar,
  History,
  Info,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'email' | 'crm' | 'calendar' | 'runs';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingActionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingActionsCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'email', label: 'Procesador de Correos', icon: Mail },
    { id: 'crm', label: 'CRM Simulado', icon: Users },
    { id: 'calendar', label: 'Calendario Simulado', icon: Calendar },
    {
      id: 'runs',
      label: 'Historial de Runs',
      icon: History,
      badge: pendingActionsCount > 0 ? pendingActionsCount : undefined,
    },
  ];

  return (
    <aside className="app-sidebar w-[17rem] h-full bg-[#0d1729] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 overflow-y-auto">
      <div className="px-5 py-5 border-b border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Navegación del Asistente
        </span>
      </div>

      <nav className="app-sidebar-nav p-4 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/8'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-[17px] h-[17px] ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Academic context notice */}
      <div className="app-sidebar-footer p-5 border-t border-white/10 text-xs text-slate-400 bg-black/15">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-200">UTP Consult · MVP</p>
            <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
              Simulaciones locales sin APIs externas (Gmail, Google Cal, CRM real fuera de alcance).
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

