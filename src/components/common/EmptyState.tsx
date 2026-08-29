import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white/50 p-12 text-center">
      {icon && <div className="mb-4 rounded-full bg-zinc-100 p-3 text-zinc-500">{icon}</div>}
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-zinc-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
