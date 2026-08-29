import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MessageCircle, Copy, Check, Sparkles, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { db } from '../../services/db/repository';
import { generateNextClientId } from '../../services/db/idGenerator';

interface QuickLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickLinkModal: React.FC<QuickLinkModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [prospectName, setProspectName] = useState('');
  const [prospectPhone, setProspectPhone] = useState('');

  // Calculate next candidate Client ID without creating it in DB
  const clients = db.getClients();
  const nextClientId = generateNextClientId(clients);

  // Link to the private client intake page on Trayectoria-web
  const clientUrl = `https://trayectoriaweb.github.io/Trayectoria-web/onboarding.html?clientId=${nextClientId}`;

  const greetingName = prospectName.trim() ? prospectName.trim() : 'hola';

  const defaultMessage = `¡Hola ${greetingName}! Te comparto este enlace exclusivo para que puedas contarnos sobre tu trabajo y el estilo que te gustaría para tu sitio web:

${clientUrl}

Te va a llevar solo 10–15 minutos y se guarda automáticamente a medida que escribís. ¡Cualquier duda avisame!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(defaultMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const cleanPhone = prospectPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ Generar Enlace para Cliente"
      subtitle="Creá un link único para que el cliente cargue sus datos sin ensuciar tu CRM con fichas vacías."
      maxWidth="lg"
    >
      <div className="space-y-5 pt-1 font-sans">
        {/* Info banner */}
        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/80 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#0033FF] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-bold">Creación 100% Automática:</strong> Al compartir este enlace, el cliente <span className="font-mono font-bold text-[#0033FF]">{nextClientId}</span> se creará automáticamente en tu panel <strong>recién cuando envíe sus datos</strong>.
          </div>
        </div>

        {/* Optional quick personalize */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Nombre del contacto (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Juan, Dra. Rossi"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:border-[#0033FF]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              WhatsApp del contacto (opcional)
            </label>
            <input
              type="tel"
              placeholder="Ej: 5491122334455"
              value={prospectPhone}
              onChange={(e) => setProspectPhone(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:border-[#0033FF]"
            />
          </div>
        </div>

        {/* Link box */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Enlace Exclusivo del Proyecto
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0033FF] bg-blue-50 px-2 py-0.5 rounded">
              ID Asignado: {nextClientId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={clientUrl}
              className="flex-1 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 select-all"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              icon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedLink ? '¡Copiado!' : 'Copiar Link'}
            </Button>
          </div>
        </div>

        {/* WhatsApp Message Box */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
            Mensaje Listo para Enviar
          </span>
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
            {defaultMessage}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMessage}
              icon={copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto"
            >
              {copiedMessage ? '¡Mensaje Copiado!' : 'Copiar Mensaje'}
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors w-full sm:w-auto shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Abrir WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
