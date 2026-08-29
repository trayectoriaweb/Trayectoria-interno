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
  ExternalLink,
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
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white select-none shrink-0 h-screen sticky top-0">
      {/* Brand Header with macOS Window styling */}
      <div className="p-5 border-b border-slate-100 space-y-3">
        {/* Window Dots */}
        <div className="flex items-center gap-1.5">
          <span className="window-dot-red" />
          <span className="window-dot-yellow" />
          <span className="window-dot-green" />
          <span className="text-[10px] font-mono text-slate-400 ml-2">Panel_2026.app</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="logo-dot" />
            <span className="font-extrabold tracking-tight text-base text-slate-950 font-display uppercase">
              TRAYECTORIA
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            Centro de Operaciones
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Mesa de Trabajo
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#0033FF] text-white shadow-sm font-bold shadow-[0_2px_12px_rgba(0,51,255,0.25)]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Cloud</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">v2026.9</span>
        </div>

        <a
          href="https://trayectoriaweb.github.io/Trayectoria-web/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:border-[#0033FF] hover:text-[#0033FF] transition-colors"
        >
          <span>Ver Web Pública</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </aside>
  );
};
