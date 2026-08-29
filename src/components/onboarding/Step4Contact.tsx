import React from 'react';
import { OnboardingData } from '../../types';
import { Input } from '../common/Input';
import { Mail, Phone, Instagram, Linkedin, Globe, MapPin, MessageSquare } from 'lucide-react';

interface Step4ContactProps {
  data: OnboardingData['contact'];
  onChange: (updates: Partial<OnboardingData['contact']>) => void;
  errors?: Record<string, string>;
}

export const Step4Contact: React.FC<Step4ContactProps> = ({ data, onChange, errors = {} }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Paso 4 de 5</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
          ¿Dónde pueden contactarte?
        </h2>
        <p className="text-sm text-zinc-500">
          Los canales directos y redes donde tus potenciales clientes o colegas pueden comunicarse con vos.
        </p>
      </div>

      {/* 1. Canal principal preferido */}
      <div className="space-y-3 bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200/80">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
          ¿Cuál querés que sea el principal medio de contacto en tu web? *
        </label>
        <p className="text-xs text-zinc-500">
          El botón de acción destacado principal de tu página.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { id: 'WhatsApp', label: 'WhatsApp Directo' },
            { id: 'Email', label: 'Email' },
            { id: 'Instagram', label: 'Mensaje de Instagram' },
            { id: 'Formulario de contacto', label: 'Formulario Web' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange({ primaryContactMethod: m.id as any })}
              className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                data.primaryContactMethod === m.id
                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-2xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Redes y Enlaces de Contacto */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
          Canales y Perfiles Sociales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="WhatsApp *"
            placeholder="+54 9 351 123 4567"
            value={data.whatsapp}
            onChange={(e) => onChange({ whatsapp: e.target.value })}
            error={errors.whatsapp}
          />
          <Input
            label="Email de contacto *"
            type="email"
            placeholder="contacto@tuweb.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="Instagram (Opcional)"
            placeholder="@tu_usuario"
            value={data.instagram}
            onChange={(e) => onChange({ instagram: e.target.value })}
          />
          <Input
            label="LinkedIn (Opcional)"
            placeholder="linkedin.com/in/tu-perfil"
            value={data.linkedin}
            onChange={(e) => onChange({ linkedin: e.target.value })}
          />
          <Input
            label="Sitio web actual o anterior (Opcional)"
            placeholder="https://..."
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
          />
          <Input
            label="Behance / Portfolio externo / Otra red (Opcional)"
            placeholder="behance.net/usuario"
            value={data.behance || data.other}
            onChange={(e) => onChange({ behance: e.target.value, other: e.target.value })}
          />
        </div>
      </div>

      {/* 3. Ubicación física / Estudio */}
      <div className="space-y-4 pt-2 border-t border-zinc-100">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
            ¿Querés mostrar dónde trabajás o tenés tu oficina/estudio?
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ showLocation: true })}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                data.showLocation
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              Sí, mostrar ubicación
            </button>
            <button
              type="button"
              onClick={() => onChange({ showLocation: false })}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                !data.showLocation
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              No, trabajo 100% online / no mostrar
            </button>
          </div>
        </div>

        {data.showLocation && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <Input
              label="Ciudad"
              placeholder="Ej. Córdoba"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
            />
            <Input
              label="Provincia / Estado"
              placeholder="Ej. Córdoba"
              value={data.province}
              onChange={(e) => onChange({ province: e.target.value })}
            />
            <Input
              label="País"
              placeholder="Ej. Argentina"
              value={data.country}
              onChange={(e) => onChange({ country: e.target.value })}
            />
            <div className="sm:col-span-3">
              <Input
                label="Dirección o Enlace de Google Maps (Opcional)"
                placeholder="Ej. Av. Hipólito Yrigoyen 450, Piso 3"
                value={data.address || data.googleMapsUrl}
                onChange={(e) => onChange({ address: e.target.value, googleMapsUrl: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
