import React from 'react';
import { ClientStatus, ProjectStatus, WebStatus, DomainStatus, TaskPriority, PaymentStatus } from '../../types';

interface StatusPillProps {
  status: ClientStatus | ProjectStatus | WebStatus | DomainStatus | TaskPriority | PaymentStatus | string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  let colorClasses = 'bg-zinc-100 text-zinc-700 border-zinc-200';
  let dotColor = 'bg-zinc-400';

  switch (status) {
    // Client & Web & Project positive states
    case 'Activo':
    case 'Publicado':
    case 'Publicada':
    case 'Al día':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
      dotColor = 'bg-emerald-500';
      break;

    // In Progress / Preview / Testing
    case 'En producción':
    case 'En desarrollo':
    case 'En diseño':
    case 'Preview':
    case 'Delegado':
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-200/60';
      dotColor = 'bg-blue-500';
      break;

    // Review / Waiting / Partial
    case 'En revisión':
    case 'Correcciones':
    case 'Esperando contenido':
    case 'Contactado':
    case 'En trámite':
    case 'Parcial':
    case 'Media':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/60';
      dotColor = 'bg-amber-500';
      break;

    // Urgent / Expired / Offline / High
    case 'Vencido':
    case 'Offline':
    case 'Alta':
    case 'Urgente':
    case 'Renovación pendiente':
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/60';
      dotColor = 'bg-rose-500';
      break;

    // Neutral / Paused / Prospect
    case 'Prospecto':
    case 'Pendiente':
    case 'Desarrollo':
    case 'Pausado':
    case 'Baja':
      colorClasses = 'bg-zinc-100 text-zinc-700 border-zinc-200';
      dotColor = 'bg-zinc-400';
      break;

    case 'Finalizado':
    case 'Cliente':
      colorClasses = 'bg-zinc-900 text-zinc-100 border-zinc-900';
      dotColor = 'bg-zinc-300';
      break;

    default:
      colorClasses = 'bg-zinc-100 text-zinc-700 border-zinc-200';
      dotColor = 'bg-zinc-400';
      break;
  }

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorClasses} ${sizeClasses} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
