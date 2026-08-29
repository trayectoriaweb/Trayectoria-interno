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
  X,
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentSection,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'dashboard' as NavSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients' as NavSection, label: 'Clientes', icon: Users },
    { id: 'projects' as NavSection, label: 'Proyectos', icon: FolderKanban },
    { id: 'webs' as NavSection, label: 'Webs', icon: Globe },
    { id: 'domains' as NavSection, label: 'Dominios', icon: Network },
    { id: 'tasks' as NavSection, label: 'Tareas', icon: CheckSquare },
    { id: 'activity' as NavSection, label: 'Actividad', icon: History },
    { id: 'settings' as NavSection, label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col p-6">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">
              T
            </div>
            <span className="font-bold tracking-tight text-sm text-zinc-950 font-display">TRAYECTORIA</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-zinc-100 text-[11px] text-zinc-400">
          TRAYECTORIA Interno v1.0
        </div>
      </div>
    </div>
  );
};
