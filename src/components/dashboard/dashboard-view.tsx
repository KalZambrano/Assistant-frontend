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
  Activity,
  Clock3,
  Hash,
  UserRound,
  FileText,
  Wrench,
  CircleDot,
  CalendarDays,
} from 'lucide-react';
import type { DashboardMetrics, Run } from '../../types';
import type { NavTab } from '../layout/sidebar';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  recentRuns: Run[];
  onNavigate: (tab: NavTab) => void;
  onSelectRun: (runId: string | number) => void;
}

interface ActivityPoint {
  label: string;
  dateKey: string;
  value: number;
}

const getDateKey = (date: Date) => date.toISOString().slice(0, 10);

const formatShortDate = (date: Date) =>
  date.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '');

const buildActivityData = (runs: Run[], fallbackTotal: number): ActivityPoint[] => {
  const validDates = runs
    .map((run) => new Date(run.createdAt))
    .filter((date) => !Number.isNaN(date.getTime()));
  const anchorDate = validDates.length > 0 ? new Date(Math.max(...validDates.map((date) => date.getTime()))) : new Date();
  const activityDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(anchorDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(anchorDate.getDate() - (6 - index));
    return date;
  });

  const runCountByDate = runs.reduce<Record<string, number>>((counts, run) => {
    const date = new Date(run.createdAt);
    if (!Number.isNaN(date.getTime())) {
      const dateKey = getDateKey(date);
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    }
    return counts;
  }, {});

  const points = activityDays.map((date) => ({
    label: formatShortDate(date),
    dateKey: getDateKey(date),
    value: runCountByDate[getDateKey(date)] || 0,
  }));

  if (points.every((point) => point.value === 0) && fallbackTotal > 0) {
    points[points.length - 1].value = fallbackTotal;
  }

  return points;
};

const getActivityPath = (points: ActivityPoint[], maxValue: number) => {
  const chartWidth = 640;
  const chartHeight = 190;
  const horizontalPadding = 32;
  const verticalPadding = 24;
  const usableWidth = chartWidth - horizontalPadding * 2;
  const usableHeight = chartHeight - verticalPadding * 2 - 22;

  return points
    .map((point, index) => {
      const x = horizontalPadding + (index / Math.max(points.length - 1, 1)) * usableWidth;
      const y = chartHeight - verticalPadding - 22 - (point.value / maxValue) * usableHeight;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
};

const getRunInitials = (sender?: string) => {
  const value = sender?.split('@')[0] || 'run';
  const parts = value.split(/[._\s-]+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

const getToolLabel = (name: string) => {
  const labels: Record<string, string> = {
    actualizar_contacto_en_crm: 'Actualizar contacto en CRM',
    agendar_reunion_en_calendar: 'Agendar reunión en calendario',
  };

  return labels[name] || name.replaceAll('_', ' ');
};

const getRunStatus = (status: string) => {
  const normalized = status.toLowerCase();
  if (['completed', 'success', 'created'].includes(normalized)) {
    return {
      label: normalized === 'created' ? 'Creado' : 'Completado',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    };
  }
  if (['failed', 'error'].includes(normalized)) {
    return {
      label: 'Fallido',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    };
  }
  if (['analyzing', 'requires_action', 'executing_tools', 'completing', 'running'].includes(normalized)) {
    return {
      label: normalized === 'requires_action' ? 'Requiere atención' : 'En proceso',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    };
  }
  return {
    label: status || 'Sin estado',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  };
};

const formatRunDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: 'Fecha no disponible', time: '—' };

  return {
    date: date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  };
};

const formatRelativeTime = (value?: string) => {
  if (!value) return 'Sin ejecuciones';
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'Fecha no disponible';

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (elapsedMinutes < 1) return 'ahora';
  if (elapsedMinutes < 60) return `hace ${elapsedMinutes} min`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `hace ${elapsedHours} ${elapsedHours === 1 ? 'hora' : 'horas'}`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  return `hace ${elapsedDays} ${elapsedDays === 1 ? 'día' : 'días'}`;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  recentRuns,
  onNavigate,
  onSelectRun,
}) => {
  const activityData = buildActivityData(recentRuns, metrics.emailsProcessed);
  const maxActivity = Math.max(...activityData.map((point) => point.value), 1);
  const activityPath = getActivityPath(activityData, maxActivity);
  const successfulExecutions = Math.max(metrics.successfulToolExecutions, 0);
  const failedExecutions = Math.max(metrics.failedToolExecutions, 0);
  const pendingExecutions = Math.max(metrics.pendingActions, 0);
  const executionTotal = successfulExecutions + failedExecutions + pendingExecutions;
  const successPercentage = executionTotal ? (successfulExecutions / executionTotal) * 100 : 0;
  const failedPercentage = executionTotal ? (failedExecutions / executionTotal) * 100 : 0;
  const donutBackground = executionTotal
    ? `conic-gradient(#10b981 0 ${successPercentage}%, #f43f5e ${successPercentage}% ${
        successPercentage + failedPercentage
      }%, #f59e0b ${successPercentage + failedPercentage}% 100%)`
    : '#e2e8f0';

  return (
    <div className="space-y-6">
      {/* Top Welcome / Hero Banner */}
      <div className="page-intro bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Panel de control UTP Assistant</h2>
          <p className="text-sm text-slate-600 mt-1">
            Supervisa el procesamiento automatizado de correos entrantes, la extracción de requerimientos y la ejecución de herramientas en CRM y Calendario local.
          </p>
        </div>
        <button
          onClick={() => onNavigate('email')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Procesar Nuevo Correo</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="metric-card metric-card--blue min-h-0 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Correos Procesados
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{metrics.emailsProcessed}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">solicitudes analizadas</span>
          </div>
        </div>

        <div className="metric-card metric-card--indigo min-h-0 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Contactos en CRM
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{metrics.contactsCount}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">registrados localmente</span>
          </div>
        </div>

        <div className="metric-card metric-card--teal min-h-0 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Reuniones Agendadas
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{metrics.meetingsScheduled}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">con fecha/hora confirmada</span>
          </div>
        </div>

        <div className="metric-card metric-card--amber min-h-0 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Acciones Pendientes / Omitidas
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-amber-600">{metrics.pendingActions}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">falta información</span>
          </div>
        </div>

        <div className="metric-card metric-card--emerald min-h-0 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Herramientas Exitosas
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-600">{metrics.successfulToolExecutions}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">ejecuciones con éxito</span>
          </div>
        </div>

        <div className="metric-card metric-card--rose min-h-0 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Herramientas Fallidas
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-700">{metrics.failedToolExecutions}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">errores técnicos</span>
          </div>
        </div>
      </div>

      {/* Dynamic charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <section className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Actividad de procesamiento</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">Correos analizados en los últimos 7 días disponibles</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
              {metrics.emailsProcessed} total
            </span>
          </div>

          <div className="mt-4 h-52">
            <svg viewBox="0 0 640 190" className="w-full h-full" role="img" aria-label="Gráfico de actividad de procesamiento">
              {[0, 0.5, 1].map((ratio) => {
                const y = 144 - ratio * 110;
                const label = Math.round(maxActivity * ratio);
                return (
                  <g key={ratio}>
                    <line x1="32" x2="608" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 5" />
                    <text x="0" y={y + 4} fill="#94a3b8" fontSize="11">{label}</text>
                  </g>
                );
              })}
              <path d={activityPath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d={`${activityPath} L 608 144 L 32 144 Z`}
                fill="url(#activityFill)"
                stroke="none"
                opacity="0.55"
              />
              <defs>
                <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {activityData.map((point, index) => {
                const x = 32 + (index / Math.max(activityData.length - 1, 1)) * 576;
                const y = 144 - (point.value / maxActivity) * 110;
                return (
                  <g key={point.dateKey}>
                    <circle cx={x} cy={y} r="4.5" fill="white" stroke="#2563eb" strokeWidth="2.5">
                      <title>{`${point.label}: ${point.value} ${point.value === 1 ? 'run' : 'runs'}`}</title>
                    </circle>
                    <text x={x} y="174" textAnchor="middle" fill="#64748b" fontSize="11">{point.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Resultado de herramientas</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">Distribución de las ejecuciones registradas</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-6">
            <div
              className="relative w-32 h-32 rounded-full shrink-0"
              style={{ background: donutBackground }}
              role="img"
              aria-label={`${successfulExecutions} exitosas, ${failedExecutions} fallidas y ${pendingExecutions} pendientes`}
            >
              <div className="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900">{executionTotal}</span>
                <span className="text-[10px] text-slate-500">ejecuciones</span>
              </div>
            </div>
            <div className="space-y-3 text-xs flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Exitosas</span>
                <strong className="text-slate-900">{successfulExecutions}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" />Fallidas</span>
                <strong className="text-slate-900">{failedExecutions}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Pendientes</span>
                <strong className="text-slate-900">{pendingExecutions}</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Runs Table */}
      {(() => {
        const completedRuns = recentRuns.filter((run) => run.status.toLowerCase() === 'completed');
        const activeRuns = recentRuns.filter((run) =>
          ['created', 'analyzing', 'requires_action', 'executing_tools', 'completing', 'running'].includes(
            run.status.toLowerCase()
          )
        );
        const failedRuns = recentRuns.filter((run) => ['failed', 'error'].includes(run.status.toLowerCase()));
        const latestRun = recentRuns.reduce<Run | undefined>((latest, run) => {
          if (!latest) return run;
          return new Date(run.createdAt).getTime() > new Date(latest.createdAt).getTime() ? run : latest;
        }, undefined);
        const latestRunDate = latestRun ? formatRunDate(latestRun.createdAt) : null;
        const completionRate = recentRuns.length ? Math.round((completedRuns.length / recentRuns.length) * 100) : 0;

        return (
          <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950">
                    Ejecuciones recientes de IA (Runs)
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">Historial de análisis y llamadas a herramientas</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('runs')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors"
              >
                Ver todos los runs <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-700">Completados</p>
                  <p className="text-2xl font-extrabold text-slate-950 mt-0.5">{completedRuns.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{completionRate}% de los runs cargados</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600">En proceso</p>
                  <p className="text-2xl font-extrabold text-slate-950 mt-0.5">{activeRuns.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeRuns.length ? 'Ejecuciones activas' : 'Sin ejecuciones activas'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600">Fallidos</p>
                  <p className="text-2xl font-extrabold text-slate-950 mt-0.5">{failedRuns.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {failedRuns.length ? 'Revisa los errores recientes' : 'Sin errores recientes'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-600">Última ejecución</p>
                  <p className="text-lg font-extrabold text-slate-950 mt-1 truncate">
                    {formatRelativeTime(latestRun?.createdAt)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {latestRunDate ? `${latestRunDate.date} · ${latestRunDate.time}` : 'Aún no hay ejecuciones'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5 w-20"><span className="inline-flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> <span className="sr-only">Identificador</span></span></th>
                      <th className="px-4 py-3.5"><span className="inline-flex items-center gap-2"><UserRound className="w-3.5 h-3.5" /> Usuario</span></th>
                      <th className="px-4 py-3.5"><span className="inline-flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Asunto</span></th>
                      <th className="px-4 py-3.5"><span className="inline-flex items-center gap-2"><Wrench className="w-3.5 h-3.5" /> Herramientas</span></th>
                      <th className="px-4 py-3.5"><span className="inline-flex items-center gap-2"><CircleDot className="w-3.5 h-3.5" /> Estado</span></th>
                      <th className="px-4 py-3.5"><span className="inline-flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Fecha</span></th>
                      <th className="px-4 py-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentRuns.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center">
                          <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-700">Aún no hay ejecuciones recientes</p>
                          <p className="text-xs text-slate-500 mt-1">Procesa un correo para ver su análisis aquí.</p>
                        </td>
                      </tr>
                    ) : (
                      recentRuns.map((run) => {
                        const runStatus = getRunStatus(run.status);
                        const runDate = formatRunDate(run.createdAt);
                        const sender = run.inputEmail?.sender || 'Sin remitente';

                        return (
                          <tr key={run.id} className="bg-white hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-4 align-middle">
                              <span className="inline-flex min-w-11 h-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 px-2 font-mono text-xs font-bold text-slate-800">
                                {run.id}
                              </span>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center gap-3 min-w-[220px]">
                                <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                                  {getRunInitials(sender)}
                                </span>
                                <span className="font-semibold text-slate-800 truncate">{sender}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle max-w-[290px]">
                              <div className="flex items-start gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </span>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 truncate">{run.inputEmail?.subject || 'Sin asunto'}</p>
                                  <p className="text-xs text-slate-500 mt-1 truncate">
                                    {run.analysis?.intent || 'Revisión y análisis de la solicitud'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex flex-col items-start gap-1.5 min-w-[220px]">
                                {(run.toolCalls || []).length === 0 ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-400">
                                    <span className="w-3.5 h-3.5 rounded-full bg-slate-400 text-white text-[10px] leading-[14px] text-center">−</span>
                                    Sin herramientas
                                  </span>
                                ) : (
                                  (run.toolCalls || []).map((toolCall, index) => {
                                    const successful = ['success', 'created', 'updated'].includes(toolCall.status.toLowerCase());
                                    return (
                                      <span
                                        key={toolCall.id || index}
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                                          successful
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-slate-50 text-slate-500 border-slate-200'
                                        }`}
                                      >
                                        {successful ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                        {getToolLabel(toolCall.name)}
                                      </span>
                                    );
                                  })
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${runStatus.badge}`}>
                                <span className={`w-2 h-2 rounded-full ${runStatus.dot}`} />
                                {runStatus.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              <p className="text-sm font-medium text-slate-700">{runDate.date}</p>
                              <p className="text-xs text-slate-500 mt-1">{runDate.time}</p>
                            </td>
                            <td className="px-4 py-4 align-middle text-right">
                              <button
                                onClick={() => onSelectRun(run.id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors whitespace-nowrap"
                              >
                                Ver detalle <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
};
