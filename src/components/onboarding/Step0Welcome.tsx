import React from 'react';
import { ArrowRight, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

interface Step0WelcomeProps {
  onStart: () => void;
  clientName?: string;
  hasSavedProgress?: boolean;
  onResetProgress?: () => void;
}

export const Step0Welcome: React.FC<Step0WelcomeProps> = ({
  onStart,
  clientName,
  hasSavedProgress,
  onResetProgress,
}) => {
  return (
    <div className="max-w-xl mx-auto text-center space-y-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
        <span className="w-2 h-2 rounded-full bg-zinc-900" />
        TRAYECTORIA
      </div>

      {/* Main Title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
          {clientName ? `Hola, ${clientName}.` : 'Empecemos por conocerte.'}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg mx-auto">
          Vamos a pedirte algunas cosas sobre tu trabajo y tu trayectoria para poder construir tu sitio. No hace falta
          que tengas todo preparado: podés completar lo que tengas y nosotros nos ocupamos del resto.
        </p>
      </div>

      {/* Key Guarantees Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
            <Clock className="w-4 h-4 text-zinc-700" />
            <span>Tiempo estimado: 10–15 minutos</span>
          </div>
          <p className="text-xs text-zinc-500">
            Preguntas puntuales, paso a paso y sin formularios eternos.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guardado automático</span>
          </div>
          <p className="text-xs text-zinc-500">
            Podés salir en cualquier momento y continuar desde donde quedaste.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto px-8 h-12 text-sm shadow-md"
        >
          {hasSavedProgress ? 'Continuar donde quedé' : 'Comenzar'}
        </Button>

        {hasSavedProgress && onResetProgress && (
          <div>
            <button
              onClick={onResetProgress}
              className="text-xs text-zinc-400 hover:text-zinc-700 underline transition-colors"
            >
              Comenzar de nuevo desde el inicio
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-zinc-400 font-medium pt-4">
        Mínimo esfuerzo para vos • Máximo rigor de diseño de TRAYECTORIA
      </p>
    </div>
  );
};
