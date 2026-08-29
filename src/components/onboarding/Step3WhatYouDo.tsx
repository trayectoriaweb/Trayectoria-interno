import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Plus, Trash2, Layers, CheckCircle2, Sparkles, FolderGit2 } from 'lucide-react';

interface Step3WhatYouDoProps {
  data: OnboardingData['offer'];
  onChange: (updates: Partial<OnboardingData['offer']>) => void;
  errors?: Record<string, string>;
}

export const Step3WhatYouDo: React.FC<Step3WhatYouDoProps> = ({ data, onChange, errors = {} }) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddService = () => {
    const next = [
      ...data.services,
      {
        id: `srv-${Date.now().toString().slice(-4)}`,
        name: '',
        description: '',
      },
    ];
    onChange({ services: next });
  };

  const handleUpdateService = (index: number, field: string, value: string) => {
    const updated = [...data.services];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ services: updated });
  };

  const handleRemoveService = (index: number) => {
    if (data.services.length <= 1) return; // Keep at least one
    const updated = data.services.filter((_, i) => i !== index);
    onChange({ services: updated });
  };

  const handleAddTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean || data.specialties.includes(clean)) return;
    onChange({ specialties: [...data.specialties, clean] });
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({ specialties: data.specialties.filter((t) => t !== tagToRemove) });
  };

  const handleAddProject = () => {
    const next = [
      ...data.projects,
      {
        id: `proj-${Date.now().toString().slice(-4)}`,
        name: '',
        description: '',
        year: new Date().getFullYear().toString(),
        url: '',
      },
    ];
    onChange({ projects: next });
  };

  const handleUpdateProject = (index: number, field: string, value: string) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ projects: updated });
  };

  const handleRemoveProject = (index: number) => {
    const updated = data.projects.filter((_, i) => i !== index);
    onChange({ projects: updated });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Paso 3 de 5</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
          Contanos qué ofrecés.
        </h2>
        <p className="text-sm text-zinc-500">
          Los servicios o soluciones que tus clientes van a encontrar en tu web. No hace falta poner precios.
        </p>
      </div>

      {/* 1. Servicios ofrecidos */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          <div>
            <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
              ¿Qué servicios ofrecés? *
            </label>
            <p className="text-xs text-zinc-500">
              Agregá al menos un servicio principal. Podés sumar los que quieras.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddService}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Agregar servicio
          </Button>
        </div>

        {errors.services && (
          <p className="text-xs font-medium text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            {errors.services}
          </p>
        )}

        <div className="space-y-3">
          {data.services.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Servicio #{idx + 1}
                </span>
                {data.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                    title="Eliminar servicio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  label="Nombre del servicio *"
                  placeholder="Ej. Proyecto de Arquitectura / Asesoramiento Legal / Diseño de Marca..."
                  value={srv.name}
                  onChange={(e) => handleUpdateService(idx, 'name', e.target.value)}
                />
                <Textarea
                  rows={2}
                  label="Breve descripción del servicio"
                  placeholder="Ej. Desarrollo integral desde el anteproyecto hasta la dirección ejecutiva de obra..."
                  value={srv.description}
                  onChange={(e) => handleUpdateService(idx, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Especialidades o Áreas clave */}
      <div className="space-y-3 pt-2 bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200/80">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
          ¿Hay alguna especialidad o área de trabajo que quieras destacar?
        </label>
        <p className="text-xs text-zinc-500">
          Palabras clave o etiquetas que definen tu experiencia. Podés escribirlas y presionar Enter.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej. Vivienda Unifamiliar, Sostenibilidad, Reformas..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag(tagInput);
              }
            }}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddTag(tagInput)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Sumar
          </Button>
        </div>

        {/* Selected tags */}
        {data.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {data.specialties.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-medium text-zinc-800 shadow-2xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-zinc-400 hover:text-zinc-700 text-xs font-bold leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Trabajos destacados / Portfolio */}
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
            ¿Querés mostrar algunos trabajos o proyectos anteriores?
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ showProjects: true })}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                data.showProjects
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              Sí, tengo trabajos para mostrar
            </button>
            <button
              type="button"
              onClick={() => onChange({ showProjects: false })}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                !data.showProjects
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              No por ahora / Saltear
            </button>
          </div>
        </div>

        {data.showProjects && (
          <div className="space-y-4 pt-3 border-t border-zinc-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-700">Proyectos o Casos de Éxito</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddProject}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Agregar proyecto
              </Button>
            </div>

            {data.projects.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
                Hacé clic en "Agregar proyecto" para sumar tu primer trabajo.
              </div>
            ) : (
              <div className="space-y-3">
                {data.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Proyecto #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Nombre del proyecto"
                        placeholder="Ej. Casa en las Sierras / Rediseño de Marca X"
                        value={proj.name}
                        onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                      />
                      <Input
                        label="Año o Enlace web (Opcional)"
                        placeholder="Ej. 2024 / https://..."
                        value={proj.url || proj.year}
                        onChange={(e) => handleUpdateProject(idx, 'url', e.target.value)}
                      />
                    </div>

                    <Textarea
                      rows={2}
                      label="Breve descripción del trabajo"
                      placeholder="Ej. Diseño y dirección integral de vivienda unifamiliar de 240 m2..."
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
