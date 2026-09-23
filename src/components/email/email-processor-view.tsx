import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Building,
  User,
  Mail,
  ArrowUpRight,
} from 'lucide-react';
import type { Run, EmailSubmission } from '../../types';
import {
  SAMPLE_EMAIL_ANA_TORRES,
  SAMPLE_EMAIL_SCHEDULE_READY,
  SAMPLE_EMAIL_INFORMATIONAL,
} from '../../services/mock-data';

interface EmailProcessorViewProps {
  onProcessEmail: (submission: EmailSubmission) => Promise<Run>;
  onViewRunDetail: (runId: string | number) => void;
  isProcessing: boolean;
}

export const EmailProcessorView: React.FC<EmailProcessorViewProps> = ({
  onProcessEmail,
  onViewRunDetail,
  isProcessing,
}) => {
  const [sender, setSender] = useState(SAMPLE_EMAIL_ANA_TORRES.sender);
  const [subject, setSubject] = useState(SAMPLE_EMAIL_ANA_TORRES.subject);
  const [body, setBody] = useState(SAMPLE_EMAIL_ANA_TORRES.body);
  const [lastRun, setLastRun] = useState<Run | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoadSample = (sample: typeof SAMPLE_EMAIL_ANA_TORRES) => {
    setSender(sample.sender);
    setSubject(sample.subject);
    setBody(sample.body);
    setErrorMsg(null);
  };

  const handleClear = () => {
    setSender('');
    setSubject('');
    setBody('');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !subject.trim() || !body.trim()) {
      setErrorMsg('Por favor completa todos los campos del correo.');
      return;
    }
    setErrorMsg(null);
    try {
      const resultRun = await onProcessEmail({ sender, subject, body });
      setLastRun(resultRun);
    } catch {
      setErrorMsg('Ocurrió un error al procesar el correo.');
    }
  };

  const analysis = lastRun?.analysis;

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="page-intro bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Procesador de Correos con IA</h2>
          <p className="text-sm text-slate-600 mt-1">
            Simula la recepción de correos de clientes, analiza entidades con IA, valida requerimientos y ejecuta llamadas a herramientas en CRM y Calendario.
          </p>
        </div>

        {/* Demo Fast Load Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Cargar Casos:
          </span>
          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_EMAIL_ANA_TORRES)}
            className="text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Caso canónico de evaluación: Falta fecha/hora de reunión"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Ana Torres (Caso Oficial)</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_EMAIL_SCHEDULE_READY)}
            className="text-xs font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Caso con fecha y hora exactas para agendar"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Fecha Confirmada</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_EMAIL_INFORMATIONAL)}
            className="text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Consulta general sin solicitud de reunión"
          >
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Informativo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Entrada de Correo Simulado
            </h3>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpiar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="sender" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Remitente (Email):
              </label>
              <input
                id="sender"
                type="email"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="ejemplo@empresa.com"
                className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Asunto:
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Asunto del correo"
                className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Cuerpo del Correo:
              </label>
              <textarea
                id="body"
                required
                rows={9}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escribe o pega el contenido del correo..."
                className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-white font-mono leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-xs transition-all ${
                isProcessing
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando con IA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Procesar con IA</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {!lastRun && !isProcessing && (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Listo para analizar correos</h4>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                Presiona <strong>"Procesar con IA"</strong> o utiliza el caso de prueba <strong>"Ana Torres"</strong> arriba para verificar el ciclo de análisis y tool calling.
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <h4 className="text-base font-bold text-slate-900">Analizando correo con IA...</h4>
              <p className="text-sm text-slate-500 mt-1">
                Extrayendo entidades, intenciones y orquestando llamadas a herramientas simuladas.
              </p>
            </div>
          )}

          {lastRun && !isProcessing && analysis && (
            <div className="space-y-4">
              {/* Run Notification Header */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                      Análisis Completado Exitosamente
                    </span>
                    <p className="text-xs text-emerald-700">
                      Run ID: <span className="font-mono font-semibold">{lastRun.id}</span> • Proveedor:{' '}
                      <span className="font-semibold">{lastRun.provider}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onViewRunDetail(lastRun.id)}
                  className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span>Ver Ciclo Completo (Run)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Extraction Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Contacto Extraído
                  </span>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nombre:</span>
                      <span className="font-semibold text-slate-900">{analysis?.contact?.name || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Empresa:</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {analysis?.contact?.company || 'No especificado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono text-xs text-slate-700">{analysis?.contact?.email || 'No especificado'}</span>
                    </div>
                  </div>
                </div>

                {/* Intent Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Intención Detectada
                  </span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {analysis?.intent || 'Consulta de cliente recibida'}
                  </p>
                </div>
              </div>

              {/* Requirements & Meeting Request */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requirements */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                    Requisitos Identificados
                  </span>
                  <div className="space-y-2">
                    {(!analysis?.requirements || analysis.requirements.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">No se especificaron requisitos detallados.</p>
                    ) : (
                      analysis.requirements.map((req, idx) => {
                        const moduleName = typeof req === 'string' ? 'Requerimiento' : req.module;
                        const desc = typeof req === 'string' ? req : req.description;
                        const priority = typeof req === 'object' && 'priority' in req ? req.priority : null;
                        return (
                          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800">{moduleName}</span>
                              {priority && (
                                <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                                  {priority.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600">{desc}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Meeting Request Status */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" /> Solicitud de Reunión
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">¿Solicitada?:</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${analysis?.meetingRequest?.requested ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-600'}`}>
                        {analysis?.meetingRequest?.requested ? 'SÍ' : 'NO'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Fecha especificada:</span>
                      <span className={`font-semibold ${analysis?.meetingRequest?.dateSpecified ? 'text-emerald-700' : 'text-amber-600 flex items-center gap-1'}`}>
                        {analysis?.meetingRequest?.dateSpecified ? analysis.meetingRequest.date : 'No especificada'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Hora especificada:</span>
                      <span className={`font-semibold ${analysis?.meetingRequest?.timeSpecified ? 'text-emerald-700' : 'text-amber-600 flex items-center gap-1'}`}>
                        {analysis?.meetingRequest?.timeSpecified ? analysis.meetingRequest.time : 'No especificada'}
                      </span>
                    </div>

                    {analysis?.meetingRequest?.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-200">
                        {analysis.meetingRequest.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 12 of SKILLS.md: Missing Information Explicit Warning */}
              {(analysis?.missingInformation || []).length > 0 && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-amber-900">
                        Información Faltante — Regla de Integridad UTP
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        El sistema nunca inventa fechas ni datos ambiguos. Las siguientes entidades no pudieron completarse automáticamente:
                      </p>
                      <ul className="mt-2 space-y-1">
                        {(analysis?.missingInformation || []).map((item, idx) => (
                          <li key={idx} className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tool Calls Execution Results */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Herramientas Solicitadas y Ejecutadas por el Backend
                </span>
                <div className="space-y-2.5">
                  {lastRun.toolCalls.map((tc) => {
                    const isSuccess = tc.status === 'success';
                    const isSkipped = tc.status === 'skipped';
                    return (
                      <div
                        key={tc.id}
                        className={`p-3 rounded-lg border text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                          isSuccess
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : isSkipped
                            ? 'bg-amber-50/60 border-amber-200'
                            : 'bg-rose-50/60 border-rose-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">{tc.name}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                isSuccess
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isSkipped
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {tc.status}
                            </span>
                          </div>
                          {tc.reason && tc.reason !== 'null' && (
                            <p className="text-slate-600 text-[11px]">{tc.reason}</p>
                          )}
                          {tc.result && (
                            <p className="text-emerald-700 text-[11px]">
                              {JSON.stringify(tc.result)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final AI Response */}
              {lastRun.finalResponse && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Respuesta Final Generada por la IA
                  </span>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-800 text-xs leading-relaxed font-sans">
                    {lastRun.finalResponse}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
