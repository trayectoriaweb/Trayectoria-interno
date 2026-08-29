import React, { useState } from 'react';
import {
  Network,
  Search,
  Plus,
  ArrowRight,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';
import { db, getDomainExpirationInfo } from '../../services/db/repository';
import { Domain, DomainRegistrar } from '../../types';
import { Button } from '../common/Button';
import { StatusPill } from '../common/StatusPill';
import { EmptyState } from '../common/EmptyState';
import { DomainAlertBadge } from './DomainAlertBadge';

interface DomainListViewProps {
  onSelectClient: (clientId: string) => void;
  onOpenNewDomain: () => void;
}

export const DomainListView: React.FC<DomainListViewProps> = ({
  onSelectClient,
  onOpenNewDomain,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registrarFilter, setRegistrarFilter] = useState<string>('Todos');

  const domains = db.getDomains();

  const filteredDomains = domains.filter((d) => {
    const matchesSearch =
      d.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegistrar = registrarFilter === 'Todos' || d.registrar === registrarFilter;

    return matchesSearch && matchesRegistrar;
  });

  const registrarOptions = ['Todos', 'NIC Argentina', 'Cloudflare Registrar', 'Otro'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
            Administración de Dominios
          </h2>
          <p className="text-xs text-zinc-500">
            Monitoreo de vencimientos, titularidad legal en NIC Argentina / Cloudflare y delegación técnica DNS.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenNewDomain}
          icon={<Plus className="w-4 h-4" />}
        >
          + Registrar Dominio
        </Button>
      </div>

      {/* Critical Expiration Legend Bar */}
      <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-semibold text-zinc-800">Semáforo de Vencimientos:</span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            &gt; 60 días (Seguro)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            30 – 60 días (Atención)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            &lt; 30 días (Urgente)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-700 animate-pulse" />
            Vencido
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por dominio (ej. juanperez.com.ar), cliente o titular..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {registrarOptions.map((reg) => (
            <button
              key={reg}
              onClick={() => setRegistrarFilter(reg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                registrarFilter === reg
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Domains Table */}
      {filteredDomains.length === 0 ? (
        <EmptyState
          icon={<Network className="w-6 h-6" />}
          title="No se encontraron dominios"
          description="Ajustá los filtros de búsqueda o registrá un nuevo dominio de cliente."
          actionLabel="+ Registrar Dominio"
          onAction={onOpenNewDomain}
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Dominio / ID</th>
                  <th className="px-4 py-3.5">Cliente</th>
                  <th className="px-4 py-3.5">Registrador</th>
                  <th className="px-4 py-3.5">Titularidad Legal</th>
                  <th className="px-4 py-3.5">Vencimiento & Alerta</th>
                  <th className="px-4 py-3.5">Administración Técnica</th>
                  <th className="px-4 py-3.5 text-right">Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredDomains.map((dom) => (
                  <tr
                    key={dom.id}
                    onClick={() => onSelectClient(dom.clientId)}
                    className="hover:bg-zinc-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Domain & ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold font-mono text-zinc-900 text-sm block">
                        {dom.domainName}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">{dom.id}</span>
                    </td>

                    {/* Client */}
                    <td className="px-4 py-3.5 font-medium text-zinc-800">{dom.clientName}</td>

                    {/* Registrar */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          dom.registrar === 'NIC Argentina'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-orange-50 text-orange-800 border border-orange-200'
                        }`}
                      >
                        {dom.registrar}
                      </span>
                    </td>

                    {/* Legal Owner */}
                    <td className="px-4 py-3.5">
                      <p className="text-zinc-800 font-medium truncate max-w-xs">{dom.owner}</p>
                      <span className="text-[10px] text-zinc-400 block">Titular en registrador</span>
                    </td>

                    {/* Expiration & Alert Badge */}
                    <td className="px-4 py-3.5 space-y-1">
                      <DomainAlertBadge expirationDate={dom.expirationDate} />
                      <span className="text-[10px] text-zinc-500 font-mono block">
                        Fecha: {dom.expirationDate}
                      </span>
                    </td>

                    {/* Managed By */}
                    <td className="px-4 py-3.5">
                      <p className="text-zinc-700 text-[11px]">{dom.managedBy}</p>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <button className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-950 inline-flex items-center gap-1">
                        Ver <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
