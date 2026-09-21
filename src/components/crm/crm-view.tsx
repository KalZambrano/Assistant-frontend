import React, { useState } from 'react';
import { Search, Building, Mail, Phone, Clock, UserCheck, ShieldCheck } from 'lucide-react';
import type { Contact, ContactStatus } from '../../types';

interface CRMViewProps {
  contacts: Contact[];
}

export const CRMView: React.FC<CRMViewProps> = ({ contacts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Empresa</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Teléfono</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Última Actualización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No se encontraron contactos con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {(contact.name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <span>{contact.name || 'Sin Nombre'}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.company}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {contact.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          contact.status
                        )}`}
                      >
                        <UserCheck className="w-3 h-3" />
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-slate-500">
                      {contact.lastUpdated ? (
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(contact.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Reciente</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
