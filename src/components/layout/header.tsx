import React from 'react';
import { Bot, Cpu, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isBackendOnline: boolean;
  activeProvider: string;
}

export const Header: React.FC<HeaderProps> = ({ isBackendOnline, activeProvider }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center shadow-xs">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">UTP Assistant</h1>
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              MVP Local
            </span>
          </div>
          <p className="text-xs text-slate-500">Asistente Inteligente de Consultoría de Software</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Backend & AI Provider Status */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <Cpu className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-600">Proveedor IA:</span>
          <span className="font-semibold text-slate-800">{activeProvider}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs">
          {isBackendOnline ? (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">FastAPI Conectado (:8000)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-700">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-medium">Modo Demo Local (Activo)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

