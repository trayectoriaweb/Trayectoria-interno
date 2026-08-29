import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, FolderKanban, Globe, Network, CheckSquare, ArrowRight, CornerDownLeft, X } from 'lucide-react';
import { db, GlobalSearchResult } from '../../services/db/repository';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: GlobalSearchResult) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults(db.searchAll(''));
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const res = db.searchAll(query);
    setResults(res);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onSelectResult(results[selectedIndex]);
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelectResult, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: GlobalSearchResult['type']) => {
    switch (type) {
      case 'client':
        return Users;
      case 'project':
        return FolderKanban;
      case 'web':
        return Globe;
      case 'domain':
        return Network;
      case 'task':
        return CheckSquare;
      default:
        return Search;
    }
  };

  const getTypeLabel = (type: GlobalSearchResult['type']) => {
    switch (type) {
      case 'client':
        return 'Cliente';
      case 'project':
        return 'Proyecto';
      case 'web':
        return 'Web';
      case 'domain':
        return 'Dominio';
      case 'task':
        return 'Tarea';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200/80 bg-white">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente, dominio, ID (TRAY-00001), repo, proyecto, email o tarea..."
            className="w-full text-sm bg-transparent border-none text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-2 divide-y divide-zinc-50">
          {results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-zinc-700">No se encontraron resultados</p>
              <p className="text-xs text-zinc-400 mt-1">
                Intentá buscar por nombre de cliente, dominio .com.ar, ID o repositorio.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, idx) => {
                const Icon = getIcon(result.type);
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={`${result.type}-${result.id}-${idx}`}
                    onClick={() => {
                      onSelectResult(result);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-md shrink-0 ${
                          isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs truncate">{result.title}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {result.id}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                              isSelected ? 'text-zinc-400' : 'text-zinc-500'
                            }`}
                          >
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate mt-0.5 ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {result.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {result.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {result.badge}
                        </span>
                      )}
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-300'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-mono">↓</kbd>
              para navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-mono">
                <CornerDownLeft className="w-2.5 h-2.5 inline" />
              </kbd>
              para abrir
            </span>
          </div>
          <span>Búsqueda Global TRAYECTORIA</span>
        </div>
      </div>
    </div>
  );
};
