import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Globe,
  Network,
  CheckSquare,
  History,
  Settings,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export type NavSection =
  | 'dashboard'
  | 'clients'
  | 'projects'
  | 'webs'
  | 'domains'
  | 'tasks'
  | 'activity'
  | 'settings';

interface SidebarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  counts?: {
    clients: number;
    projects: number;
    webs: number;
    domains: number;
    tasks: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentSection, onNavigate, counts }) => {
  const menuItems = [
    { id: 'dashboard' as NavSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients' as NavSection, label: 'Clientes', icon: Users, count: counts?.clients },
    { id: 'projects' as NavSection, label: 'Proyectos', icon: FolderKanban, count: counts?.projects },
    { id: 'webs' as NavSection, label: 'Webs', icon: Globe, count: counts?.webs },
    { id: 'domains' as NavSection, label: 'Dominios', icon: Network, count: counts?.domains },
    { id: 'tasks' as NavSection, label: 'Tareas', icon: CheckSquare, count: counts?.tasks },
    { id: 'activity' as NavSection, label: 'Actividad', icon: History },
    { id: 'settings' as NavSection, label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200/80 bg-white select-none shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white font-bold text-xs tracking-tighter">
              T
            </div>
            <span className="font-bold tracking-tight text-sm text-zinc-950 font-display">TRAYECTORIA</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase mt-1">
            Sistema Interno de Gestión
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Operaciones
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                    isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        <div className="flex items-center gap-2.5 p-2 rounded-lg border border-zinc-200/60 bg-white">
          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-800 shrink-0 font-medium text-xs">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-900 truncate">Operaciones</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-zinc-500 truncate">Panel Privado</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
