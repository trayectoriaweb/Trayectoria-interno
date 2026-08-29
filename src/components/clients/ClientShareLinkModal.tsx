import React, { useState } from 'react';
import { Client } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MessageCircle, Copy, Check, ExternalLink, Sparkles, Send } from 'lucide-react';

interface ClientShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export const ClientShareLinkModal: React.FC<ClientShareLinkModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Dedicated clean link to Trayectoria-web
  const clientUrl = `https://trayectoriaweb.github.io/Trayectoria-web/onboarding.html?clientId=${client.id}`;

  const firstName = client.fullName.split(' ')[0] || 'hola';

  const defaultMessage = `¡Hola ${firstName}! Te comparto este enlace para que puedas completar la información sobre tu trabajo y el estilo que te gustaría para tu sitio web:

${clientUrl}

Te va a llevar unos 10–15 minutos y se guarda automáticamente a medida que escribís. ¡Cualquier duda avisame!`;

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

  const cleanPhone = client.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enviar Formulario a ${client.fullName}`}
      subtitle="Compartí este enlace exclusivo para que el cliente cargue sus datos de forma guiada en 15 minutos."
      maxWidth="lg"
    >
      <div className="space-y-5 pt-2">
        {/* Link box */}
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
            Enlace Individual del Cliente
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={clientUrl}
              className="flex-1 text-xs font-mono bg-white border border-zinc-200 px-3 py-2 rounded-lg text-zinc-800 select-all"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              icon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedLink ? 'Copiado' : 'Copiar Link'}
            </Button>
          </div>
        </div>

        {/* WhatsApp Ready Message Box */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
            Mensaje Listo para WhatsApp
          </span>
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs text-zinc-800 whitespace-pre-wrap font-sans leading-relaxed">
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

            {client.whatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors w-full sm:w-auto shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Abrir en WhatsApp
              </a>
            )}
          </div>
        </div>

        <p className="text-[11px] text-zinc-400">
          El cliente accederá directamente a su pantalla limpia sin ver ningún dato administrativo ni técnico.
        </p>
      </div>
    </Modal>
  );
};
