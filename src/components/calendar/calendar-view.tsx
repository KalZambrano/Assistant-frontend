import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import type { Meeting, MeetingStatus } from '../../types';

interface CalendarViewProps {
  meetings: Meeting[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ meetings }) => {
  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Calendario Local Simulado</h2>
            <span className="text-[11px] font-semibold bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-200">
              Gestión Interna
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Reuniones creadas tras validar que el correo del cliente incluye fecha y hora exactas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-lg">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Nota de Alcance:</strong> No sincronizado con Google Calendar. Persistencia local en backend.
          </span>
        </div>
      </div>

      {/* Meetings Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {meetings.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No hay reuniones agendadas aún</h4>
            <p className="text-xs text-slate-500 mt-1">
              Las reuniones se agendan automáticamente cuando el correo contiene fecha y hora exactas.
            </p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      meeting.status
                    )}`}
                  >
                    {meeting.status === 'Scheduled' && <CheckCircle2 className="w-3 h-3" />}
                    {meeting.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                    {meeting.status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#{meeting.id}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2">{meeting.title}</h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{meeting.client}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>
                      Fecha: <strong className="text-slate-800">{meeting.date}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Hora: <strong className="text-slate-800">{meeting.time}</strong> ({meeting.durationMinutes} min)
                    </span>
                  </div>

                  {meeting.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-slate-500 text-[11px]">
                      <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{meeting.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Registrado localmente</span>
                <span className="text-emerald-600 font-semibold">Listo para sesión</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
