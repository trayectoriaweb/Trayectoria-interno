import React, { useState } from 'react';
import { Search, Plus, Menu, Command, UserCheck } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenSearch: () => void;
  onOpenNewClient: () => void;
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onOpenNewDomain: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenSearch,
  onOpenNewClient,
  onOpenNewProject,
  onOpenNewTask,
  onOpenNewDomain,
  onToggleMobileMenu,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-md">
      {/* Left side: title + mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2">
            {title}
          </h1>
          {subtitle && <p className="text-xs text-zinc-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right side: Global search button + Quick actions + User profile badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/80 hover:border-zinc-300 text-xs text-zinc-500 transition-colors shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">Buscar cliente, repo, dominio...</span>
          <span className="inline md:hidden">Buscar...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-zinc-200 text-zinc-400 rounded">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Quick actions dropdown */}
        <div className="relative">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Nuevo</span>
          </Button>

          {showQuickMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-1.5 shadow-xl border border-zinc-200 z-50 animate-in fade-in-50 zoom-in-95">
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewClient();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  + Nuevo Cliente
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewProject();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  + Nuevo Proyecto
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewDomain();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  + Registrar Dominio
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewTask();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  + Nueva Tarea
                </button>
              </div>
            </>
          )}
        </div>

        {/* Status pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50/70 text-[11px] font-medium text-emerald-800">
          <UserCheck className="w-3 h-3 text-emerald-600" />
          <span>Panel Operativo</span>
        </div>
      </div>
    </header>
  );
};
