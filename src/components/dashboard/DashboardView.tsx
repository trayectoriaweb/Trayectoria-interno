import React, { useState } from 'react';
import {
  Users,
  FolderKanban,
  Globe,
  Network,
  CheckSquare,
  AlertTriangle,
  FileText,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { db, getDomainExpirationInfo } from '../../services/db/repository';
import { Button } from '../common/Button';
import { DomainAlertBadge } from '../domains/DomainAlertBadge';
import { StatusPill } from '../common/StatusPill';
import { NavSection } from '../layout/Sidebar';
import { ActivityModal } from '../activity/ActivityModal';

interface DashboardViewProps {
  onNavigate: (section: NavSection, clientId?: string) => void;
  onOpenNewClient: () => void;
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onOpenNewDomain: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewClient,
  onOpenNewProject,
  onOpenNewTask,
  onOpenNewDomain,
}) => {
  const stats = db.getStatistics();
  const domains = db.getDomains();
  const activityLogs = db.getActivityLogs().slice(0, 6);
  const tasks = db.getTasks().filter((t) => !t.completed).slice(0, 4);
  const clients = db.getClients().slice(0, 4);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Sort domains by expiration date (soonest first)
  const sortedExpiringDomains = [...domains].sort((a, b) => {
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              Centro de Operaciones TRAYECTORIA
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 font-display">
              Resumen Operativo del Negocio
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              Control centralizado de clientes, proyectos web, registros de dominio, contenido editorial y despliegues técnicos.
            </p>
          </div>

          {/* Quick Actions Group */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenNewClient}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Nuevo Cliente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenNewProject}
              icon={<FolderKanban className="w-3.5 h-3.5" />}
            >
              Nuevo Proyecto
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenNewDomain}
              icon={<Network className="w-3.5 h-3.5" />}
            >
              Registrar Dominio
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Clientes */}
        <div
          onClick={() => onNavigate('clients')}
          className="group p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-subtle transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Clientes Totales</span>
            <Users className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
              {stats.totalClients}
            </span>
            <span className="text-xs text-zinc-500 font-medium">{stats.activeClients} activos</span>
          </div>
        </div>

        {/* Proyectos en Producción */}
        <div
          onClick={() => onNavigate('projects')}
          className="group p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-subtle transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">En Producción</span>
            <FolderKanban className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
              {stats.projectsInProduction}
            </span>
            <span className="text-xs text-zinc-500 font-medium">{stats.pendingProjects} pendientes</span>
          </div>
        </div>

        {/* Webs Activas */}
        <div
          onClick={() => onNavigate('webs')}
          className="group p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-subtle transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Webs Activas</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
              {stats.activeWebs}
            </span>
            <span className="text-xs text-emerald-600 font-medium">En línea</span>
          </div>
        </div>

        {/* Dominios Próximos a Vencer */}
        <div
          onClick={() => onNavigate('domains')}
          className={`group p-5 rounded-xl border transition-all cursor-pointer ${
            stats.expiringDomainsCount > 0
              ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
              : 'border-zinc-200 bg-white hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Vencimiento Dominios
            </span>
            <AlertTriangle
              className={`w-4 h-4 ${
                stats.expiringDomainsCount > 0 ? 'text-amber-600' : 'text-zinc-400'
              }`}
            />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
              {stats.expiringDomainsCount}
            </span>
            <span className="text-xs text-zinc-500 font-medium">&le; 60 días</span>
          </div>
        </div>
      </div>

      {/* Secondary Status Badges Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div
          onClick={() => onNavigate('tasks')}
          className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50/80 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">Tareas Pendientes</p>
              <p className="text-[11px] text-zinc-500">Recordatorios de clientes, revisiones y entrega</p>
            </div>
          </div>
          <span className="text-base font-bold text-zinc-900 font-mono">{stats.pendingTasksCount}</span>
        </div>

        <div
          onClick={() => onNavigate('clients')}
          className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50/80 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">Clientes Esperando Contenido</p>
              <p className="text-[11px] text-zinc-500">Fichas con contenido incompleto o fotos pendientes</p>
            </div>
          </div>
          <span className="text-base font-bold text-blue-700 font-mono">{stats.clientsWaitingContent}</span>
        </div>
      </div>

      {/* Main Two Column Operational Grid: Expiring Domains + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Próximos Vencimientos de Dominios (NIC Argentina / Cloudflare) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2">
                <Network className="w-4 h-4 text-zinc-700" />
                Próximos Vencimientos de Dominios
              </h3>
              <p className="text-xs text-zinc-500">Monitoreo de delegación técnica y titularidad de clientes</p>
            </div>
            <button
              onClick={() => onNavigate('domains')}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1"
            >
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 shadow-xs overflow-hidden">
            {sortedExpiringDomains.map((dom) => {
              const info = getDomainExpirationInfo(dom.expirationDate);

              return (
                <div
                  key={dom.id}
                  onClick={() => onNavigate('clients', dom.clientId)}
                  className="p-4 hover:bg-zinc-50/80 transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 font-mono">{dom.domainName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium">
                        {dom.registrar}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      Cliente: <span className="text-zinc-700 font-medium">{dom.clientName}</span> • Vence:{' '}
                      {dom.expirationDate}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <DomainAlertBadge expirationDate={dom.expirationDate} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Pending Tasks Box */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-zinc-700" />
                Tareas Operativas Inmediatas
              </h3>
              <Button variant="ghost" size="sm" onClick={onOpenNewTask}>
                + Tarea
              </Button>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 shadow-xs overflow-hidden">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onNavigate('tasks')}
                  className="p-3.5 hover:bg-zinc-50 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        db.toggleTask(task.id);
                      }}
                      className="w-4 h-4 rounded border border-zinc-300 hover:border-zinc-900 flex items-center justify-center shrink-0"
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-900 truncate">{task.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {task.clientName ? `Cliente: ${task.clientName}` : 'General'} • Vence: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={task.priority} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actividad Reciente & Resumen de Clientes */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-700" />
                Actividad Reciente
              </h3>
              <p className="text-xs text-zinc-500">Historial cronológico de entregables, estados y cambios</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsActivityModalOpen(true)}>
              + Agregar Actividad
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-zinc-900">
                        {log.clientName ? `${log.clientName} — ` : ''}
                        {log.title}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono shrink-0">{log.date}</span>
                    </div>
                    <p className="text-zinc-600 mt-0.5">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => onNavigate('activity')}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1"
              >
                Ver historial completo <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Client Overview */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-700" />
                Fichas Recientes
              </h3>
              <button
                onClick={() => onNavigate('clients')}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => onNavigate('clients', client.id)}
                  className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-zinc-900 truncate">{client.fullName}</span>
                    <StatusPill status={client.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 truncate">{client.profession}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-mono">{client.id}</span>
                    <span>{client.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />
    </div>
  );
};
