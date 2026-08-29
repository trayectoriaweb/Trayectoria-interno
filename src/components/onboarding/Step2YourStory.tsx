import React from 'react';
import { OnboardingData } from '../../types';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Plus, Trash2, BookOpen, Briefcase, HelpCircle } from 'lucide-react';

interface Step2YourStoryProps {
  data: OnboardingData['story'];
  onChange: (updates: Partial<OnboardingData['story']>) => void;
  errors?: Record<string, string>;
}

export const Step2YourStory: React.FC<Step2YourStoryProps> = ({ data, onChange, errors = {} }) => {
  const handleAddExperience = () => {
    const next = [
      ...data.experiences,
      {
        id: `exp-${Date.now().toString().slice(-4)}`,
        place: '',
        role: '',
        year: '',
        description: '',
      },
    ];
    onChange({ experiences: next });
  };

  const handleUpdateExperience = (index: number, field: string, value: string) => {
    const updated = [...data.experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ experiences: updated });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = data.experiences.filter((_, i) => i !== index);
    onChange({ experiences: updated });
  };

  const handleAddEducation = () => {
    const next = [
      ...data.education,
      {
        id: `edu-${Date.now().toString().slice(-4)}`,
        institution: '',
        career: '',
        year: '',
      },
    ];
    onChange({ education: next });
  };

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ education: updated });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = data.education.filter((_, i) => i !== index);
    onChange({ education: updated });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Paso 2 de 5</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
          Queremos conocer tu recorrido.
        </h2>
        <p className="text-sm text-zinc-500">
          No hace falta escribir textos largos ni académicos. Contanos lo esencial con tus propias palabras.
        </p>
      </div>

      {/* 1. Presentación */}
      <div className="space-y-3 bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200/80">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
          Si alguien entra a tu web, ¿cómo te gustaría presentarte? *
        </label>
        <p className="text-xs text-zinc-500">
          Escribí 2 o 3 oraciones sencillas. En TRAYECTORIA nos encargamos de pulir la redacción final para tu web.
        </p>
        <Textarea
          rows={4}
          placeholder="Soy arquitecto especializado en proyectos residenciales sustentables. Mi enfoque combina diseño contemporáneo, eficiencia energética y materiales locales para crear espacios funcionales y confortables..."
          value={data.presentation}
          onChange={(e) => onChange({ presentation: e.target.value })}
          error={errors.presentation}
        />
      </div>

      {/* 2. Trayectoria / Experiencias destacadas */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-zinc-600" />
              ¿Qué experiencias profesionales te gustaría destacar?
            </h3>
            <p className="text-xs text-zinc-500">
              Opcional. Lugares donde trabajaste, proyectos que dirigiste o roles relevantes.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddExperience}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Agregar experiencia
          </Button>
        </div>

        {data.experiences.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
            No agregaste experiencias todavía. (Podés dejarlo vacío si preferís no mostrarlas).
          </div>
        ) : (
          <div className="space-y-3">
            {data.experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Experiencia #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Lugar / Empresa / Estudio"
                    placeholder="Ej. Estudio González"
                    value={exp.place}
                    onChange={(e) => handleUpdateExperience(idx, 'place', e.target.value)}
                  />
                  <Input
                    label="Rol o Cargo"
                    placeholder="Ej. Arquitecto Asociado"
                    value={exp.role}
                    onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                  />
                  <Input
                    label="Año o Período"
                    placeholder="Ej. 2019 – 2023"
                    value={exp.year}
                    onChange={(e) => handleUpdateExperience(idx, 'year', e.target.value)}
                  />
                </div>

                <Input
                  label="Breve descripción (Opcional)"
                  placeholder="Ej. Dirección de proyectos y coordinación de obras."
                  value={exp.description}
                  onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Formación / Estudios */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-600" />
              ¿Qué estudios o formación querés mostrar?
            </h3>
            <p className="text-xs text-zinc-500">
              Opcional. Título universitario, posgrados, certificaciones o cursos clave.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEducation}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Agregar formación
          </Button>
        </div>

        {data.education.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
            No agregaste estudios todavía. (Podés dejarlo vacío si preferís saltearlo).
          </div>
        ) : (
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div
                key={edu.id}
                className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Estudio #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Institución / Universidad"
                    placeholder="Ej. UNC / UBA"
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                  />
                  <Input
                    label="Carrera / Título"
                    placeholder="Ej. Grado en Arquitectura"
                    value={edu.career}
                    onChange={(e) => handleUpdateEducation(idx, 'career', e.target.value)}
                  />
                  <Input
                    label="Año de egreso"
                    placeholder="Ej. 2018"
                    value={edu.year}
                    onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
