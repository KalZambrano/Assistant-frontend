import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Mail,
  Cpu,
  Terminal,
  FileCode,
  Sparkles,
} from 'lucide-react';
import type { Run, ToolExecutionStatus } from '../../types';

interface RunsViewProps {
  runs: Run[];
  selectedRunId?: string | number | null;
  onSelectRun: (id: string | number) => void;
}

export const RunsView: React.FC<RunsViewProps> = ({
  runs,
  selectedRunId,
  onSelectRun,
}) => {
  const activeRun = runs.find((r) => String(r.id) === String(selectedRunId)) || runs[0];
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  const getStatusBadge = (status: ToolExecutionStatus) => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'skipped':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'requires_confirmation':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'failed':
      default:
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="page-intro bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Historial de Ejecuciones (Runs)</h2>
            <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
              Auditoría y Trazabilidad IA
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Visualiza el ciclo completo de interacción: entrada, análisis cognitivo, llamadas a herramientas y respuesta final.
          </p>
        </div>

        <button
          onClick={() => setShowJsonRaw(!showJsonRaw)}
          className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <FileCode className="w-3.5 h-3.5 text-slate-500" />
          <span>{showJsonRaw ? 'Ocultar JSON' : 'Ver Payload JSON'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Runs List (4 cols) */}
        <div className="lg:col-span-4 max-h-350 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">
            Seleccionar Ejecución ({runs.length})
          </span>

          <div className="space-y-1.5 max-h-300 overflow-y-auto p-2">
            {runs.map((r) => {
              const isSelected = String(activeRun?.id) === String(r.id);
              const hasSkipped = (r.toolCalls || []).some((tc) => tc.status === 'skipped');
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRun(r.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">Run #{r.id}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-800 truncate mt-1">
                    {r.inputEmail?.subject || `Ejecución #${r.id}`}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{r.inputEmail?.sender || '—'}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> {r.provider}
                    </span>
                    {hasSkipped ? (
                      <span className="text-amber-700 bg-amber-50 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                        Acción Omitida
                      </span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                        {r.status}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Run Lifecycle Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {!activeRun ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
              No hay ejecuciones disponibles.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Detalle de Ciclo: {activeRun.id}</h3>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      {activeRun.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Registrado el {new Date(activeRun.createdAt).toLocaleString()} • Modelo: <span className="font-semibold text-slate-700">{activeRun.model}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>{(activeRun.toolCalls || []).length} herramientas llamadas</span>
                </div>
              </div>

              {/* Sequential Stepper */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {/* Step 1: Email Received */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-blue-600" /> 1. Correo Recibido
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">Paso inicial</span>
                    </div>
                    <p className="text-slate-700">
                      <strong>De:</strong> {activeRun.inputEmail?.sender || 'No especificado'}
                    </p>
                    <p className="text-slate-700">
                      <strong>Asunto:</strong> {activeRun.inputEmail?.subject || 'Sin Asunto'}
                    </p>
                    <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[11px] whitespace-pre-line">
                      {activeRun.inputEmail?.body || 'Sin contenido de correo'}
                    </div>
                  </div>
                </div>

                {/* Step 2: AI Cognitive Analysis */}
                {activeRun.analysis && (
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-purple-50/40 border border-purple-200 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" /> 2. Análisis Cognitivo de IA
                        </span>
                        <span className="text-purple-600 font-medium text-[10px]">{activeRun.provider}</span>
                      </div>
                      <p className="text-slate-700">
                        <strong>Intención detectada:</strong> {activeRun.analysis.intent || 'Solicitud de cliente'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="bg-white p-2.5 rounded border border-purple-100">
                          <span className="font-semibold text-slate-800 block text-[11px] mb-1">
                            Información Confirmada:
                          </span>
                          <ul className="space-y-0.5 text-slate-600 text-[11px]">
                            {(activeRun.analysis.confirmedInformation || []).map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1 text-emerald-700">
                                <span>✓</span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white p-2.5 rounded border border-purple-100">
                          <span className="font-semibold text-slate-800 block text-[11px] mb-1">
                            Información Faltante:
                          </span>
                          {(activeRun.analysis.missingInformation || []).length > 0 ? (
                            <ul className="space-y-0.5 text-amber-700 text-[11px]">
                              {(activeRun.analysis.missingInformation || []).map((item, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <span>⚠</span> {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Ninguna, datos completos</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Tool Calls & Execution */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-xs">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-indigo-600" /> 3. Solicitud y Ejecución de Herramientas
                      </span>
                      <span className="text-slate-400 text-[10px]">Decisión IA vs Backend</span>
                    </div>

                    <div className="space-y-2.5">
                      {(activeRun.toolCalls || []).length === 0 ? (
                        <p className="text-slate-400 italic text-xs">No se ejecutaron herramientas en esta ejecución.</p>
                      ) : (
                        activeRun.toolCalls.map((tc, idx) => {
                          const badge = getStatusBadge(tc.status);
                          return (
                            <div
                              key={tc.id || idx}
                              className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-slate-900 text-xs">
                                  {tc.name}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badge.bg}`}
                                >
                                  {badge.icon}
                                  {tc.status}
                                </span>
                              </div>

                              {/* Arguments */}
                              <div className="bg-slate-50 p-2 rounded border border-slate-100 font-mono text-[11px] text-slate-700">
                                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">
                                  Parámetros enviados:
                                </span>
                                {typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments, null, 2)}
                              </div>

                              {/* Reason or Result */}
                              {tc.reason && (
                                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 flex items-start gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <span>{tc.reason}</span>
                                </div>
                              )}

                              {tc.result && (
                                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200 flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>Resultado: {typeof tc.result === 'string' ? tc.result : JSON.stringify(tc.result)}</span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4: Final Response */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4. Respuesta Final Generada
                      </span>
                      <span className="text-emerald-700 font-semibold text-[10px]">Fin del Run</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-sans bg-white p-3 rounded border border-emerald-100">
                      {activeRun.finalResponse || 'Respuesta generada correctamente.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Raw JSON Debugging Modal / Toggle */}
              {showJsonRaw && (
                <div className="mt-4 p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
                  <pre>{JSON.stringify(activeRun, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
