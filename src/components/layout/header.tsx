import React from 'react';
import { Bot, Cpu, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isBackendOnline: boolean;
  activeProvider: string;
}

export const Header: React.FC<HeaderProps> = ({ isBackendOnline, activeProvider }) => {
  return (
    <header className="min-h-18 bg-white/95 backdrop-blur border-b border-slate-200 px-7 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[1.05rem] font-extrabold text-slate-950 tracking-tight">UTP Assistant</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200">
              MVP LOCAL
            </span>
          </div>
          <p className="text-xs text-slate-500">Asistente Inteligente de Consultoría de Software</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend & AI Provider Status */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
          <Cpu className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-500">Proveedor IA</span>
          <span className="font-semibold text-slate-800">{activeProvider}</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs bg-white">
          {isBackendOnline ? (
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">FastAPI conectado · :8000</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-700">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold">Modo demo local · activo</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

