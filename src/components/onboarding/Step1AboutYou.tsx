import React from 'react';
import { OnboardingData } from '../../types';
import { Input } from '../common/Input';
import { User, Camera, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

interface Step1AboutYouProps {
  data: OnboardingData['personal'];
  onChange: (updates: Partial<OnboardingData['personal']>) => void;
  errors?: Record<string, string>;
}

export const Step1AboutYou: React.FC<Step1AboutYouProps> = ({ data, onChange, errors = {} }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Paso 1 de 5</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
          Empecemos por lo básico.
        </h2>
        <p className="text-sm text-zinc-500">
          Contanos tus datos principales para configurar la estructura de tu sitio profesional.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            placeholder="Ej. Juan"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            error={errors.firstName}
            autoFocus
          />
          <Input
            label="Apellido *"
            placeholder="Ej. Pérez"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            error={errors.lastName}
          />
        </div>

        {/* Nombre Profesional y Cómo querés que aparezca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre profesional o de marca (Opcional)"
            placeholder="Ej. Estudio Pérez / Juan Pérez Arquitectura"
            value={data.brandName}
            onChange={(e) => onChange({ brandName: e.target.value })}
            helperText="Si tenés un nombre comercial o de estudio."
          />
          <Input
            label="¿Cómo querés que aparezca tu nombre en tu sitio?"
            placeholder="Ej. Arq. Juan Pérez / Juan Pérez"
            value={data.preferredName}
            onChange={(e) => onChange({ preferredName: e.target.value })}
            helperText="Título o encabezado principal de la web."
          />
        </div>

        {/* Profesión y Especialidad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Profesión *"
            placeholder="Ej. Arquitecto, Diseñadora, Abogado, Psicóloga..."
            value={data.profession}
            onChange={(e) => onChange({ profession: e.target.value })}
            error={errors.profession}
          />
          <Input
            label="Especialidad principal (Opcional)"
            placeholder="Ej. Arquitectura Residencial y Sustentable"
            value={data.specialty}
            onChange={(e) => onChange({ specialty: e.target.value })}
          />
        </div>

        {/* Ciudad y Contacto rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Ciudad / Ubicación"
            placeholder="Ej. Córdoba, Argentina"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
          />
          <Input
            label="Email *"
            type="email"
            placeholder="tu@email.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="WhatsApp *"
            placeholder="+54 9 351 123 4567"
            value={data.whatsapp}
            onChange={(e) => onChange({ whatsapp: e.target.value })}
            error={errors.whatsapp}
          />
        </div>

        {/* Foto profesional */}
        <div className="pt-2 space-y-3">
          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
            ¿Tenés una foto profesional que quieras usar?
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'uploaded',
                title: 'Sí, subir foto o URL',
                desc: 'Tengo una imagen lista',
              },
              {
                id: 'send_later',
                title: 'La tengo, la envío después',
                desc: 'Por WhatsApp o email',
              },
              {
                id: 'none',
                title: 'No tengo todavía',
                desc: 'Usar avatar o ilustrativo',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ photoStatus: opt.id as any })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  data.photoStatus === opt.id
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-2xs'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800'
                }`}
              >
                <div className="text-xs font-bold">{opt.title}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    data.photoStatus === opt.id ? 'text-zinc-300' : 'text-zinc-400'
                  }`}
                >
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          {data.photoStatus === 'uploaded' && (
            <div className="pt-2">
              <Input
                label="Enlace a tu foto (Drive, Dropbox, LinkedIn, etc.)"
                placeholder="https://..."
                value={data.photoUrl || ''}
                onChange={(e) => onChange({ photoUrl: e.target.value })}
                helperText="O podés pasarla por WhatsApp cuando te contactemos."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
