import React, { useState } from 'react';
import {
  Globe,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  GitBranch,
  Server,
  Code2,
} from 'lucide-react';
import { db } from '../../services/db/repository';
import { WebSite, WebStatus } from '../../types';
import { Button } from '../common/Button';
import { StatusPill } from '../common/StatusPill';
import { EmptyState } from '../common/EmptyState';

interface WebListViewProps {
  onSelectClient: (clientId: string) => void;
  onOpenNewWeb: () => void;
}

export const WebListView: React.FC<WebListViewProps> = ({
  onSelectClient,
  onOpenNewWeb,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  const webs = db.getWebs();

  const filteredWebs = webs.filter((w) => {
    const matchesSearch =
      w.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.primaryDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.githubRepoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.cloudflareProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || w.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['Todos', 'Publicada', 'Preview', 'Desarrollo', 'En revisión', 'Mantenimiento', 'Offline'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
            Administración de Webs
          </h2>
          <p className="text-xs text-zinc-500">
            Control de sitios web, repositorios de código, proyectos de Cloudflare Pages y URLs.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenNewWeb}
          icon={<Plus className="w-4 h-4" />}
        >
          + Nueva Web
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por dominio, sitio, cliente, repo o proyecto Cloudflare..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>

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
      </div>

      {/* Webs Table */}
      {filteredWebs.length === 0 ? (
        <EmptyState
          icon={<Globe className="w-6 h-6" />}
          title="No se encontraron webs"
          description="Ajustá los términos de búsqueda o registrá una nueva web operativa."
          actionLabel="+ Nueva Web"
          onAction={onOpenNewWeb}
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">ID / Sitio Web</th>
                  <th className="px-4 py-3.5">Cliente</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-4 py-3.5">Dominio & URLs</th>
                  <th className="px-4 py-3.5">GitHub Repo & Cloudflare</th>
                  <th className="px-4 py-3.5">Stack</th>
                  <th className="px-4 py-3.5 text-right">Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredWebs.map((web) => (
                  <tr
                    key={web.id}
                    onClick={() => onSelectClient(web.clientId)}
                    className="hover:bg-zinc-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Site & ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-zinc-900 block">{web.siteName}</span>
                      <span className="font-mono text-[10px] text-zinc-400">{web.id}</span>
                    </td>

                    {/* Client */}
                    <td className="px-4 py-3.5 font-medium text-zinc-800">{web.clientName}</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusPill status={web.status} size="sm" />
                    </td>

                    {/* Domain & URLs */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-zinc-900 block">{web.primaryDomain}</span>
                      <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                        {web.productionUrl && (
                          <a
                            href={web.productionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                          >
                            Producción <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {web.previewUrl && (
                          <a
                            href={web.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            Preview <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Repo & Cloudflare */}
                    <td className="px-4 py-3.5 space-y-0.5 text-zinc-600">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-800">
                        <GitBranch className="w-3 h-3 text-zinc-400" />
                        <span>{web.githubRepoName || 'Sin repo asignado'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <Server className="w-3 h-3 text-zinc-400" />
                        <span>{web.cloudflareProject || 'Sin proyecto'}</span>
                      </div>
                    </td>

                    {/* Framework */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-medium">
                        <Code2 className="w-3 h-3 text-zinc-500" />
                        {web.framework}
                      </span>
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
