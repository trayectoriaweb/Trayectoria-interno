import React, { useState } from 'react';
import {
  History,
  Search,
  Plus,
  ArrowRight,
  Clock,
  Filter,
} from 'lucide-react';
import { db } from '../../services/db/repository';
import { ActivityLog } from '../../types';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ActivityModal } from './ActivityModal';

interface ActivityListViewProps {
  onSelectClient: (clientId: string) => void;
}

export const ActivityListView: React.FC<ActivityListViewProps> = ({ onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const activityLogs = db.getActivityLogs();

  const filteredLogs = activityLogs.filter((log) => {
    return (
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.clientName && log.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
            Historial de Actividad & Auditoría
          </h2>
          <p className="text-xs text-zinc-500">
            Registro cronológico consolidado de todas las altas, modificaciones, entregas de contenido y publicaciones.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsActivityModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          + Agregar Actividad
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, título de evento o descripción..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={<History className="w-6 h-6" />}
          title="No se encontraron eventos de actividad"
          description="Ajustá los términos de búsqueda o registrá un nuevo evento manual."
          actionLabel="+ Registrar Actividad"
          onAction={() => setIsActivityModalOpen(true)}
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative text-xs space-y-1 group">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-zinc-900 border-2 border-white ring-2 ring-zinc-200 group-hover:bg-blue-600 transition-colors" />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">{log.title}</span>
                    {log.clientName && (
                      <button
                        onClick={() => log.clientId && onSelectClient(log.clientId)}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold hover:bg-zinc-200"
                      >
                        {log.clientName}
                      </button>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 shrink-0">{log.date}</span>
                </div>

                <p className="text-zinc-600 leading-relaxed">{log.description}</p>
                <span className="text-[10px] text-zinc-400 block pt-0.5">
                  Registrado por: {log.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />
    </div>
  );
};
