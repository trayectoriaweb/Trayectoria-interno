import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Mail,
  Instagram,
  Linkedin,
  MapPin,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { db, calculateContentCompleteness } from '../../services/db/repository';
import { Client, ClientStatus } from '../../types';
import { Button } from '../common/Button';
import { StatusPill } from '../common/StatusPill';
import { EmptyState } from '../common/EmptyState';
import { DomainAlertBadge } from '../domains/DomainAlertBadge';

interface ClientListViewProps {
  onSelectClient: (clientId: string) => void;
  onOpenNewClient: () => void;
}

export const ClientListView: React.FC<ClientListViewProps> = ({
  onSelectClient,
  onOpenNewClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const clients = db.getClients();

  const statusOptions = [
    'Todos',
    'Activo',
    'En producción',
    'Esperando contenido',
    'Contactado',
    'Prospecto',
    'Pausado',
    'Finalizado',
  ];

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.primaryDomain && client.primaryDomain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      client.whatsapp.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'Esperando contenido'
        ? !client.content.portfolio.isComplete || !client.content.identity.isComplete
        : client.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
            Directorio de Clientes
          </h2>
          <p className="text-xs text-zinc-500">
            Administración completa de fichas de clientes, historial, contenido y datos técnicos.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenNewClient}
          icon={<Plus className="w-4 h-4" />}
        >
          + Nuevo Cliente
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, profesión, dominio, email, WhatsApp o ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center gap-1 border-l border-zinc-200 pl-3">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md ${
              viewMode === 'table' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-700'
            }`}
            title="Vista Tabla"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md ${
              viewMode === 'grid' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-700'
            }`}
            title="Vista Tarjetas"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No se encontraron clientes"
          description="Probá ajustando el término de búsqueda o seleccioná otro filtro de estado."
          actionLabel="+ Nuevo Cliente"
          onAction={onOpenNewClient}
        />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">ID / Cliente</th>
                  <th className="px-4 py-3.5">Profesión & Ubicación</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-4 py-3.5">Dominio & Web</th>
                  <th className="px-4 py-3.5">Contenido</th>
                  <th className="px-4 py-3.5">Contacto Rápido</th>
                  <th className="px-4 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredClients.map((client) => {
                  const contentStatus = calculateContentCompleteness(client.content);

                  return (
                    <tr
                      key={client.id}
                      onClick={() => onSelectClient(client.id)}
                      className="hover:bg-zinc-50/80 cursor-pointer transition-colors group"
                    >
                      {/* ID & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {client.photoUrl ? (
                            <img
                              src={client.photoUrl}
                              alt={client.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {client.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-zinc-900 group-hover:text-zinc-950 block truncate">
                              {client.fullName}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">{client.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Profession & City */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-zinc-800 truncate">{client.profession}</p>
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          {client.city}, {client.country}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusPill status={client.status} size="sm" />
                      </td>

                      {/* Domain & Expiry */}
                      <td className="px-4 py-3.5">
                        {client.primaryDomain ? (
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-semibold text-zinc-900 block truncate">
                              {client.primaryDomain}
                            </span>
                            {client.domainExpiration && (
                              <DomainAlertBadge expirationDate={client.domainExpiration} />
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">Sin dominio asignado</span>
                        )}
                      </td>

                      {/* Content completeness */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                contentStatus.isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${contentStatus.percentage}%` }}
                            />
                          </div>
                          <span
                            className={`text-[11px] font-medium ${
                              contentStatus.isComplete ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {contentStatus.percentage}%
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          {contentStatus.isComplete ? '✓ Completo' : `⚠ Faltan ${contentStatus.missingCount} secciones`}
                        </span>
                      </td>

                      {/* Quick Contact Links */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          {client.whatsapp && (
                            <a
                              href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-md hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              title="Abrir WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {client.email && (
                            <a
                              href={`mailto:${client.email}`}
                              className="p-1.5 rounded-md hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                              title="Enviar Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {client.instagram && (
                            <a
                              href={`https://instagram.com/${client.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-md hover:bg-pink-50 hover:text-pink-700 transition-colors"
                              title="Ver Instagram"
                            >
                              <Instagram className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right">
                        <button className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-800 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all">
                          Ver Ficha <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const contentStatus = calculateContentCompleteness(client.content);

            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-subtle transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {client.photoUrl ? (
                        <img
                          src={client.photoUrl}
                          alt={client.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-sm shrink-0">
                          {client.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900">{client.fullName}</h4>
                        <p className="text-xs text-zinc-500">{client.profession}</p>
                      </div>
                    </div>
                    <StatusPill status={client.status} size="sm" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">ID Operativo:</span>
                      <span className="font-mono font-medium text-zinc-800">{client.id}</span>
                    </div>

                    {client.primaryDomain && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400">Dominio:</span>
                        <span className="font-mono text-zinc-900 font-semibold">{client.primaryDomain}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">Contenido Web:</span>
                      <span
                        className={`font-medium ${
                          contentStatus.isComplete ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {contentStatus.percentage}% {contentStatus.isComplete ? '✓' : '⚠'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    Alta: {client.createdAt}
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1">
                    Abrir Ficha <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
