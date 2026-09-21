import React from 'react';
import {
  Mail,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { DashboardMetrics, Run } from '../../types';
import type { NavTab } from '../layout/sidebar';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  recentRuns: Run[];
  onNavigate: (tab: NavTab) => void;
  onSelectRun: (runId: string | number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  recentRuns,
  onNavigate,
  onSelectRun,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Welcome / Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Panel de Control UTP Assistant</h2>
          <p className="text-sm text-slate-600 mt-1">
            Supervisa el procesamiento automatizado de correos entrantes, la extracción de requerimientos y la ejecución de herramientas en CRM y Calendario local.
          </p>
        </div>
        <button
          onClick={() => onNavigate('email')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Procesar Nuevo Correo</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Correos Procesados
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.emailsProcessed}</span>
            <span className="text-xs text-slate-500">solicitudes analizadas</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contactos en CRM
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.contactsCount}</span>
            <span className="text-xs text-slate-500">registrados localmente</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reuniones Agendadas
            </span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.meetingsScheduled}</span>
            <span className="text-xs text-slate-500">con fecha/hora confirmada</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Acciones Pendientes / Omitidas
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{metrics.pendingActions}</span>
            <span className="text-xs text-slate-500">falta información (ej. fecha)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Herramientas Exitosas
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{metrics.successfulToolExecutions}</span>
            <span className="text-xs text-slate-500">ejecuciones con éxito</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Herramientas Fallidas
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-700">{metrics.failedToolExecutions}</span>
            <span className="text-xs text-slate-500">errores técnicos</span>
          </div>
        </div>
      </div>

      {/* Recent Runs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Ejecuciones Recientes de IA (Runs)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Historial de análisis y llamadas a herramientas</p>
          </div>
          <button
            onClick={() => onNavigate('runs')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Ver todos los runs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">ID / Fecha</th>
                <th className="px-5 py-3">Remitente</th>
                <th className="px-5 py-3">Asunto</th>
                <th className="px-5 py-3">Herramientas</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-semibold text-slate-900">{run.id}</span>
                    <p className="text-[11px] text-slate-400">
                      {new Date(run.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {run.inputEmail?.sender || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                    {run.inputEmail?.subject || 'Sin Asunto'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {(run.toolCalls || []).length === 0 ? (
                        <span className="text-[10px] text-slate-400 italic">Sin herramientas</span>
                      ) : (
                        (run.toolCalls || []).map((tc, idx) => (
                          <span
                            key={tc.id || idx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                              tc.status === 'success' || tc.status === 'created' || tc.status === 'updated'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : tc.status === 'skipped'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {tc.name} ({tc.status})
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {run.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onSelectRun(run.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
