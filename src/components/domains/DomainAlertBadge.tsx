import React from 'react';
import { getDomainExpirationInfo } from '../../services/db/repository';
import { AlertCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DomainAlertBadgeProps {
  expirationDate: string;
  showIcon?: boolean;
}

export const DomainAlertBadge: React.FC<DomainAlertBadgeProps> = ({ expirationDate, showIcon = true }) => {
  const info = getDomainExpirationInfo(expirationDate);

  let badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let Icon = CheckCircle2;

  if (info.statusCategory === 'expired') {
    badgeStyles = 'bg-rose-100 text-rose-900 border-rose-300 font-semibold animate-pulse';
    Icon = AlertCircle;
  } else if (info.statusCategory === 'danger') {
    badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
    Icon = AlertTriangle;
  } else if (info.statusCategory === 'warning') {
    badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
    Icon = Clock;
  } else {
    badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    Icon = CheckCircle2;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${badgeStyles}`}
      title={`Fecha de vencimiento: ${expirationDate}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{info.label}</span>
    </span>
  );
};
