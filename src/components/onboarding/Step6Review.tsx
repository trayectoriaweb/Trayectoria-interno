import React from 'react';
import { OnboardingData } from '../../types';
import { Button } from '../common/Button';
import { Check, Edit3, Send, ShieldCheck, Sparkles, User, BookOpen, Briefcase, Phone, Palette } from 'lucide-react';

interface Step6ReviewProps {
  data: OnboardingData;
  onEditStep: (stepIndex: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const Step6Review: React.FC<Step6ReviewProps> = ({
  data,
  onEditStep,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="space-y-2 border-b border-zinc-100 pb-5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Check className="w-3.5 h-3.5" />
          Información lista para enviar
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
          Ya tenemos todo.
        </h2>
        <p className="text-sm text-zinc-500">
          Revisá el resumen de tus respuestas antes de enviar. Podés hacer clic en "Editar" en cualquier sección si
          querés corregir algo.
        </p>
      </div>

      {/* 5 Summary Cards */}
      <div className="space-y-3">
        {/* 1. Sobre vos */}
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                1. Sobre vos
              </h3>
            </div>
            <p className="text-sm font-semibold text-zinc-900">
              {data.personal.firstName} {data.personal.lastName} — {data.personal.profession || 'Profesional'}
            </p>
            <p className="text-xs text-zinc-500">
              Nombre en web: "{data.personal.preferredName || `${data.personal.firstName} ${data.personal.lastName}`}" • {data.personal.city || 'Argentina'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(1)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
            className="shrink-0 self-start sm:self-center"
          >
            Editar
          </Button>
        </div>

        {/* 2. Tu historia */}
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                2. Tu historia
              </h3>
            </div>
            <p className="text-xs text-zinc-700 line-clamp-2 italic">
              "{data.story.presentation || 'Presentación cargada'}"
            </p>
            <p className="text-[11px] text-zinc-500">
              {data.story.experiences.length} experiencia(s) destacada(s) • {data.story.education.length} estudio(s)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(2)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
            className="shrink-0 self-start sm:self-center"
          >
            Editar
          </Button>
        </div>

        {/* 3. Qué hacés */}
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-zinc-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                3. Qué hacés
              </h3>
            </div>
            <p className="text-sm font-semibold text-zinc-900">
              {data.offer.services.filter((s) => s.name.trim()).length} servicio(s) registrado(s)
            </p>
            <p className="text-xs text-zinc-500">
              {data.offer.specialties.length > 0
                ? `Especialidades: ${data.offer.specialties.slice(0, 3).join(', ')}`
                : 'Sin especialidades adicionales'}
              {data.offer.showProjects ? ` • ${data.offer.projects.length} proyecto(s) en portfolio` : ''}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(3)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
            className="shrink-0 self-start sm:self-center"
          >
            Editar
          </Button>
        </div>

        {/* 4. Dónde encontrarte */}
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                4. Dónde encontrarte
              </h3>
            </div>
            <p className="text-sm font-semibold text-zinc-900">
              Contacto principal: {data.contact.primaryContactMethod}
            </p>
            <p className="text-xs text-zinc-500">
              WhatsApp: {data.contact.whatsapp || 'No especificado'} • Email: {data.contact.email}
              {data.contact.instagram ? ` • IG: ${data.contact.instagram}` : ''}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(4)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
            className="shrink-0 self-start sm:self-center"
          >
            Editar
          </Button>
        </div>

        {/* 5. Cómo querés que se vea */}
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-zinc-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                5. Cómo querés que se vea
              </h3>
            </div>
            <p className="text-sm font-semibold text-zinc-900">
              Estilo: {data.style.moodTags.join(', ') || 'Profesional'}
            </p>
            <p className="text-xs text-zinc-500">
              Logo: {data.style.hasLogo ? 'Sí' : 'Tipográfico'} • {data.style.referenceUrls.length} referencia(s) web
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(5)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
            className="shrink-0 self-start sm:self-center"
          >
            Editar
          </Button>
        </div>
      </div>

      {/* Submission CTA Box */}
      <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <h4 className="text-sm font-bold">Ahora nosotros nos ocupamos de todo</h4>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Con esto ya podemos empezar a trabajar en la propuesta y arquitectura de tu sitio. Si después necesitamos
          algún detalle puntual o una fotografía adicional, te lo vamos a pedir directamente.
        </p>

        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onSubmit}
            disabled={isSubmitting}
            icon={<Send className="w-4 h-4" />}
            className="w-full sm:w-auto bg-white text-zinc-900 hover:bg-zinc-100 h-12 px-8 font-bold text-sm"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar información'}
          </Button>
        </div>
      </div>
    </div>
  );
};
