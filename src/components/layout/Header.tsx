import React, { useState } from 'react';
import { Search, Plus, Menu, Command, UserCheck, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenSearch: () => void;
  onOpenQuickLink: () => void;
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
  onOpenQuickLink,
  onOpenNewClient,
  onOpenNewProject,
  onOpenNewTask,
  onOpenNewDomain,
  onToggleMobileMenu,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Left side: title + mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-950 font-display flex items-center gap-2">
            {title}
          </h1>
          {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right side: Global search button + Quick link + Quick actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Generar Enlace Rápido Direct Action */}
        <button
          onClick={onOpenQuickLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100/90 text-[#0033FF] text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">⚡ Generar Enlace para Cliente</span>
          <span className="inline md:hidden">⚡ Enlace</span>
        </button>

        {/* Global search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-xs text-slate-500 transition-colors shadow-2xs font-sans"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Buscar...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 text-slate-400 rounded">
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
            className="bg-[#0033FF] hover:bg-[#0026CC] text-white shadow-sm font-bold"
          >
            <span className="hidden sm:inline">+ Crear</span>
          </Button>

          {showQuickMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickMenu(false)} />
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-50 animate-in fade-in-50 zoom-in-95">
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenQuickLink();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-[#0033FF] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  ⚡ Enlace para Cliente
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewClient();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0033FF]" />
                  + Nuevo Cliente Manual
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewProject();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  + Nuevo Proyecto
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewDomain();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  + Nuevo Dominio
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewTask();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  + Nueva Tarea
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
