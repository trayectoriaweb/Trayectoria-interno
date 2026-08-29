import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  ArrowRight,
  List,
  LayoutGrid,
  Calendar,
  User,
  CheckCircle2,
} from 'lucide-react';
import { db } from '../../services/db/repository';
import { Project, ProjectStatus } from '../../types';
import { Button } from '../common/Button';
import { StatusPill } from '../common/StatusPill';
import { EmptyState } from '../common/EmptyState';

interface ProjectListViewProps {
  onSelectClient: (clientId: string) => void;
  onOpenNewProject: () => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  onSelectClient,
  onOpenNewProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  const projects = db.getProjects();

  const statusColumns: ProjectStatus[] = [
    'Pendiente',
    'Esperando contenido',
    'En diseño',
    'En desarrollo',
    'En revisión',
    'Correcciones',
    'Publicado',
    'Finalizado',
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || proj.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
            Pipeline de Proyectos
          </h2>
          <p className="text-xs text-zinc-500">
            Seguimiento de etapas de diseño, maquetación, correcciones y publicación final.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenNewProject}
          icon={<Plus className="w-4 h-4" />}
        >
          + Nuevo Proyecto
        </Button>
      </div>

      {/* Filter and View Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre de proyecto, cliente o ID (TRAY-00001-P01)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'kanban' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tablero Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'table' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Tabla</span>
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-6 h-6" />}
          title="No se encontraron proyectos"
          description="Ajustá los términos de búsqueda o creá un nuevo proyecto operativo."
          actionLabel="+ Nuevo Proyecto"
          onAction={onOpenNewProject}
        />
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px] items-start">
            {statusColumns.map((colStatus) => {
              const colProjects = filteredProjects.filter((p) => p.status === colStatus);

              return (
                <div
                  key={colStatus}
                  className="w-72 shrink-0 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3 flex flex-col max-h-[75vh]"
                >
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-zinc-200/60">
                    <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                      {colStatus}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-zinc-200 text-zinc-700">
                      {colProjects.length}
                    </span>
                  </div>

                  <div className="space-y-3 pt-3 overflow-y-auto flex-1 pr-0.5">
                    {colProjects.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-zinc-200 rounded-lg text-[11px] text-zinc-400">
                        Sin proyectos
                      </div>
                    ) : (
                      colProjects.map((proj) => {
                        const totalCheck = proj.checklist?.length || 0;
                        const doneCheck = proj.checklist?.filter((c) => c.completed).length || 0;
                        const checkPct = totalCheck > 0 ? Math.round((doneCheck / totalCheck) * 100) : 0;

                        return (
                          <div
                            key={proj.id}
                            onClick={() => onSelectClient(proj.clientId)}
                            className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-subtle transition-all cursor-pointer space-y-3 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-mono text-[10px] font-bold text-zinc-400">
                                {proj.id}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-zinc-800 bg-zinc-100 px-1.5 py-0.5 rounded">
                                {proj.price}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-zinc-900 group-hover:text-zinc-950">
                                {proj.name}
                              </h4>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                Cliente: <span className="font-semibold text-zinc-700">{proj.clientName}</span>
                              </p>
                            </div>

                            {totalCheck > 0 && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                                  <span>Checklist</span>
                                  <span className="font-mono">{doneCheck}/{totalCheck} ({checkPct}%)</span>
                                </div>
                                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      checkPct === 100 ? 'bg-emerald-500' : 'bg-zinc-800'
                                    }`}
                                    style={{ width: `${checkPct}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[10px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-400" />
                                Entrega: {proj.estimatedDeliveryDate}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">ID / Proyecto</th>
                  <th className="px-4 py-3.5">Cliente</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-4 py-3.5">Fechas (Inicio / Entrega)</th>
                  <th className="px-4 py-3.5">Precio</th>
                  <th className="px-4 py-3.5">Responsable</th>
                  <th className="px-4 py-3.5 text-right">Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    onClick={() => onSelectClient(proj.clientId)}
                    className="hover:bg-zinc-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-zinc-900 block">{proj.name}</span>
                      <span className="font-mono text-[10px] text-zinc-400">{proj.id}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-zinc-800">{proj.clientName}</td>
                    <td className="px-4 py-3.5">
                      <StatusPill status={proj.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-zinc-600">
                      <span>{proj.startDate}</span>
                      <span className="text-zinc-400"> &rarr; </span>
                      <span className="font-medium text-zinc-900">{proj.estimatedDeliveryDate}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-semibold text-zinc-900">{proj.price}</td>
                    <td className="px-4 py-3.5 text-zinc-600">{proj.responsible}</td>
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
