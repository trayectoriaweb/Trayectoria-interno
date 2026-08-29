import React from 'react';
import { CheckCircle2, Sparkles, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';

interface Step7SuccessProps {
  clientName?: string;
  onGoBackToReview?: () => void;
}

export const Step7Success: React.FC<Step7SuccessProps> = ({ clientName, onGoBackToReview }) => {
  return (
    <div className="max-w-xl mx-auto text-center space-y-8 py-10 sm:py-16 animate-in fade-in zoom-in-95 duration-500">
      {/* Big Animated Icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      {/* Title & Feedback */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          Información recibida ✓
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
          Perfecto. Ahora nos toca a nosotros.
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-md mx-auto">
          {clientName ? `${clientName}, ya` : 'Ya'} tenemos todo lo necesario para comenzar a diseñar y desarrollar tu
          sitio web profesional en TRAYECTORIA.
        </p>
      </div>

      {/* What happens next */}
      <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
          ¿Cuáles son los siguientes pasos?
        </h3>

        <ol className="space-y-3 text-xs text-zinc-600">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <span>
              <strong>Arquitectura y redacción:</strong> Estructuramos tu contenido, jerarquía visual y secciones.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <span>
              <strong>Desarrollo y diseño:</strong> Maquetamos tu web con diseño responsive, ultra rápido y optimizado.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <span>
              <strong>Preview privada:</strong> Te enviaremos un enlace privado para que veas el resultado y nos des tu feedback.
            </span>
          </li>
        </ol>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onGoBackToReview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onGoBackToReview}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Ver resumen enviado
          </Button>
        )}
      </div>

      <p className="text-[11px] text-zinc-400">
        TRAYECTORIA — Sistema de Gestión y Desarrollo Web Profesional
      </p>
    </div>
  );
};
