import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { db } from '../../services/db/repository';
import { Task, TaskPriority } from '../../types';
import { Button } from '../common/Button';
import { StatusPill } from '../common/StatusPill';
import { EmptyState } from '../common/EmptyState';

interface TaskListViewProps {
  onSelectClient: (clientId: string) => void;
  onOpenNewTask: () => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  onSelectClient,
  onOpenNewTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'pending' | 'completed' | 'all'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<string>('Todos');

  const tasks = db.getTasks();

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.clientName && t.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterMode === 'all' || (filterMode === 'pending' ? !t.completed : t.completed);

    const matchesPriority = priorityFilter === 'Todos' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
            Tareas Operativas
          </h2>
          <p className="text-xs text-zinc-500">
            Control de acciones pendientes, envíos de preview, cobranzas y recordatorios de dominios.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenNewTask}
          icon={<Plus className="w-4 h-4" />}
        >
          + Nueva Tarea
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
            placeholder="Buscar por título de tarea, cliente o ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* State filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterMode === 'pending'
                  ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterMode === 'completed'
                  ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Completadas
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Todas
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block"></div>

          {/* Priority filter pills */}
          <div className="flex items-center gap-1">
            {(['Todos', 'Urgente', 'Alta', 'Media', 'Baja'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  priorityFilter === p
                    ? p === 'Urgente'
                      ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                      : p === 'Alta'
                      ? 'bg-amber-100 text-amber-800 font-bold border border-amber-200'
                      : 'bg-zinc-900 text-white font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-6 h-6" />}
          title="No hay tareas en esta vista"
          description="Creá una nueva tarea operativa o cambiá los filtros."
          actionLabel="+ Nueva Tarea"
          onAction={onOpenNewTask}
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 shadow-xs overflow-hidden">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => db.toggleTask(task.id)}
              className="p-4 hover:bg-zinc-50/80 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    db.toggleTask(task.id);
                  }}
                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'border-zinc-300 hover:border-zinc-900 bg-white'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">{task.id}</span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-zinc-500 line-clamp-1">{task.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-0.5">
                    {task.clientName && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (task.clientId) onSelectClient(task.clientId);
                        }}
                        className="hover:underline text-zinc-600 font-medium"
                      >
                        Cliente: {task.clientName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      Vence: {task.dueDate}
                    </span>
                    <span>Asignado: {task.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusPill status={task.priority} size="sm" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    db.deleteTask(task.id);
                  }}
                  className="p-1.5 text-zinc-300 hover:text-rose-600 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
