import React, { useEffect, useState } from 'react';
import {
  Search,
  Building,
  Mail,
  Phone,
  Clock,
  UserCheck,
  ShieldCheck,
  X,
  ChevronRight,
  Hash,
  CalendarDays,
} from 'lucide-react';
import type { Contact, ContactStatus } from '../../types';

interface CRMViewProps {
  contacts: Contact[];
}

export const CRMView: React.FC<CRMViewProps> = ({ contacts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!selectedContact) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedContact(null);
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedContact]);

  const filteredContacts = contacts.filter((contact) => {
    const name = contact.name || '';
    const company = contact.company || '';
    const email = contact.email || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL' ||
      (contact.status && contact.status.toUpperCase() === selectedStatus.toUpperCase());

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ContactStatus | null | undefined) => {
    const normalized = (status || 'New').toLowerCase();
    switch (normalized) {
      case 'customer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'qualified':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'lead':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'new':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'No registrada';

    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? date
      : parsedDate.toLocaleString('es-PE', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
  };

  const detailRow = (
    icon: React.ReactNode,
    label: string,
    value: React.ReactNode,
    muted = false
  ) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className={`mt-0.5 text-sm break-words ${muted ? 'text-slate-400' : 'text-slate-700'}`}>
          {value || 'No registrado'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-intro bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">CRM Simulado (Contactos Locales)</h2>
            <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Persistencia Local
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Contactos actualizados y creados automáticamente mediante la herramienta <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">actualizar_contacto_en_crm</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Simulación interna (sin CRM en la nube)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, empresa o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Lead', 'Qualified', 'Contacted', 'Customer', 'New'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st === 'ALL' ? 'Todos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts grid */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No se encontraron contactos</h3>
          <p className="text-xs text-slate-500 mt-1">Prueba con otro nombre, empresa, email o estado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredContacts.map((contact) => {
            const contactName = contact.name || 'Sin nombre';
            const companyName = contact.company || 'Sin empresa';

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelectedContact(contact)}
                aria-label={`Ver información de ${contactName}`}
                className="group bg-white border border-slate-200 rounded-xl p-5 text-left shadow-xs hover:border-blue-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {contactName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 truncate">{contactName}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                      <Building className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{companyName}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Contact detail drawer */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setSelectedContact(null)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-drawer-title"
            className="ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-base font-bold shrink-0">
                    {(selectedContact.name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 id="contact-drawer-title" className="text-lg font-bold text-slate-900 truncate">
                      {selectedContact.name || 'Sin nombre'}
                    </h2>
                    <p className="text-sm text-slate-500 truncate">{selectedContact.company || 'Sin empresa'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  aria-label="Cerrar detalle del contacto"
                  className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                    selectedContact.status
                  )}`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  {selectedContact.status || 'New'}
                </span>
              </div>
            </div>

            <div className="flex-1 p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Información del contacto</h3>
              <div>
                {detailRow(<Mail className="w-4 h-4" />, 'Email', selectedContact.email)}
                {detailRow(
                  <Phone className="w-4 h-4" />,
                  'Teléfono',
                  selectedContact.phone,
                  !selectedContact.phone
                )}
                {detailRow(<Building className="w-4 h-4" />, 'Empresa', selectedContact.company, !selectedContact.company)}
                {detailRow(<Hash className="w-4 h-4" />, 'ID de contacto', selectedContact.id)}
                {detailRow(
                  <Clock className="w-4 h-4" />,
                  'Última actualización',
                  formatDate(selectedContact.lastUpdated || selectedContact.updated_at),
                  !selectedContact.lastUpdated && !selectedContact.updated_at
                )}
                {detailRow(
                  <CalendarDays className="w-4 h-4" />,
                  'Fecha de creación',
                  formatDate(selectedContact.createdAt || selectedContact.created_at),
                  !selectedContact.createdAt && !selectedContact.created_at
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs text-slate-500">
              Contacto almacenado en la persistencia local del CRM.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
