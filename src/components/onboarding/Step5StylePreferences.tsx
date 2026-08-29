import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { Input, Textarea } from '../common/Input';
import { Palette, Check, Plus, Trash2, Heart, Ban, Camera } from 'lucide-react';
import { Button } from '../common/Button';

interface Step5StylePreferencesProps {
  data: OnboardingData['style'];
  onChange: (updates: Partial<OnboardingData['style']>) => void;
  errors?: Record<string, string>;
}

const MOOD_OPTIONS = [
  { id: 'Profesional', desc: 'Serio, confiable, sólido' },
  { id: 'Minimalista', desc: 'Limpio, espacios en blanco, foco en contenido' },
  { id: 'Elegante', desc: 'Sofisticado, refinado, sobrio' },
  { id: 'Cercano', desc: 'Cálido, humano, accesible' },
  { id: 'Moderno', desc: 'Tipografías actuales, visual y dinámico' },
  { id: 'Creativo', desc: 'Innovador, diferenciado, expresivo' },
  { id: 'Institucional', desc: 'Corporativo, estructurado, formal' },
  { id: 'Experimental', desc: 'Audaz, vanguardista, rompe esquemas' },
];

const COLOR_PRESETS = [
  { name: 'Monocromo & Neutro', colors: ['#18181B', '#71717A', '#F4F4F5'] },
  { name: 'Azul Marino & Acero', colors: ['#0F172A', '#2563EB', '#F1F5F9'] },
  { name: 'Tierra & Cálido', colors: ['#292524', '#78716C', '#F5F5F4'] },
  { name: 'Verde Bosque & Salvia', colors: ['#14532D', '#16A34A', '#F0FDF4'] },
  { name: 'Bordeaux & Piedra', colors: ['#4C0519', '#9F1239', '#FFF1F2'] },
];

export const Step5StylePreferences: React.FC<Step5StylePreferencesProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [refUrlInput, setRefUrlInput] = useState('');

  const toggleMoodTag = (tag: string) => {
    const exists = data.moodTags.includes(tag);
    if (exists) {
      onChange({ moodTags: data.moodTags.filter((t) => t !== tag) });
    } else {
      onChange({ moodTags: [...data.moodTags, tag] });
    }
  };

  const handleAddRefUrl = () => {
    const clean = refUrlInput.trim();
    if (!clean) return;
    onChange({ referenceUrls: [...data.referenceUrls, clean] });
    setRefUrlInput('');
  };

  const handleRemoveRefUrl = (index: number) => {
    onChange({ referenceUrls: data.referenceUrls.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Paso 5 de 5</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
          Ahora pensemos en el estilo.
        </h2>
        <p className="text-sm text-zinc-500">
          Para que la dirección visual represente tu personalidad profesional. No te preocupes por detalles técnicos.
        </p>
      </div>

      {/* 1. Logo / Identidad */}
      <div className="space-y-3 bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200/80">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
          ¿Tenés logo o isotipo?
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ hasLogo: true })}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              data.hasLogo
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Sí, tengo logo
          </button>
          <button
            type="button"
            onClick={() => onChange({ hasLogo: false, logoUrl: '' })}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              !data.hasLogo
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            No, usar tipografía limpia
          </button>
        </div>

        {data.hasLogo && (
          <div className="pt-2">
            <Input
              label="Enlace a tu logo o Drive (Opcional)"
              placeholder="https://... (o lo podés pasar luego por WhatsApp)"
              value={data.logoUrl || ''}
              onChange={(e) => onChange({ logoUrl: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* 2. Sensación / Mood del sitio */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
          ¿Cómo querés que se sienta tu sitio? (Podés elegir varios)
        </label>
        <p className="text-xs text-zinc-500">
          Elegí los conceptos que mejor definan la experiencia que buscás transmitir.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = data.moodTags.includes(mood.id);
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => toggleMoodTag(mood.id)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-2xs'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{mood.id}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <p
                  className={`text-[11px] mt-1 line-clamp-2 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-400'
                  }`}
                >
                  {mood.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Colores preferidos */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
          ¿Hay colores que quieras usar?
        </label>
        <p className="text-xs text-zinc-500">
          Podés elegir una paleta sugerida o simplemente escribir tus preferencias ("azul oscuro y beige", "#1A1A1A", etc.).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              data.colors.length > 0 &&
              data.colors.every((c, i) => c === preset.colors[i]);
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onChange({ colors: preset.colors, customColorNotes: preset.name })}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50'
                }`}
              >
                <span className="text-xs font-medium text-zinc-800">{preset.name}</span>
                <div className="flex items-center gap-1.5">
                  {preset.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-zinc-300 shadow-2xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <Input
          placeholder="O escribí tus colores acá (ej. Gris grafito, verde oliva, blanco roto...)"
          value={data.customColorNotes || ''}
          onChange={(e) => onChange({ customColorNotes: e.target.value })}
        />
      </div>

      {/* 4. Sitios de referencia que te gusten */}
      <div className="space-y-3 pt-2 border-t border-zinc-100">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
          ¿Hay algún sitio web que te guste como referencia? (Opcional)
        </label>
        <p className="text-xs text-zinc-500">
          Pegá enlaces de páginas de colegas, marcas o estudios que tengan una vibra o estructura que te guste.
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://ejemplo.com"
            value={refUrlInput}
            onChange={(e) => setRefUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddRefUrl();
              }
            }}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRefUrl}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Agregar URL
          </Button>
        </div>

        {data.referenceUrls.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {data.referenceUrls.map((url, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-xs font-mono"
              >
                <span className="truncate text-zinc-700">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRefUrl(idx)}
                  className="text-zinc-400 hover:text-rose-600 p-1 ml-2"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Textarea
          rows={2}
          label="¿Qué te gusta de esos sitios o de tu estilo ideal?"
          placeholder="Ej. Me gusta que las fotos se vean grandes, que la tipografía sea minimalista y que el menú sea simple..."
          value={data.referenceNotes || ''}
          onChange={(e) => onChange({ referenceNotes: e.target.value })}
        />
      </div>

      {/* 5. Lo que NO querés */}
      <div className="space-y-3 pt-2 bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200/80">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <Ban className="w-3.5 h-3.5 text-zinc-500" />
          ¿Hay algo que definitivamente NO quieras en tu web? (Opcional)
        </label>
        <Textarea
          rows={2}
          placeholder="Ej. No me gustan los fondos oscuros, no quiero efectos que mareen, no quiero mostrar precios..."
          value={data.negativePreferences || ''}
          onChange={(e) => onChange({ negativePreferences: e.target.value })}
        />
      </div>

      {/* 6. Fotografías adicionales */}
      <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
          <Camera className="w-4 h-4 text-zinc-600" />
          Fotografías adicionales o de proyectos
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Si tenés carpetas de fotos en Google Drive o Dropbox, podés pegar el enlace acá o enviárnoslo por WhatsApp
          después. No bloquea el inicio del diseño.
        </p>
        <Input
          placeholder="Enlace a carpeta de Drive / Dropbox / Fotos (Opcional)"
          value={data.additionalPhotosNotes || ''}
          onChange={(e) => onChange({ additionalPhotosNotes: e.target.value })}
        />
      </div>
    </div>
  );
};
