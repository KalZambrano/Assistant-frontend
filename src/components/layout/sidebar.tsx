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
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 overflow-y-auto">
      <div className="p-4 border-b border-slate-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navegación del Asistente
        </span>
      </div>

      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 bg-slate-950/40">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-slate-300">UTP Consult - MVP</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulaciones locales sin APIs externas (Gmail, Google Cal, CRM real fuera de alcance).
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

