import React, { useState } from 'react';
import { Client } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Copy, Check, FileJson, FileText, Sparkles, Download } from 'lucide-react';

interface ClientExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export const ClientExportModal: React.FC<ClientExportModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'json'>('prompt');
  const [copied, setCopied] = useState(false);

  // Generate clean AI prompt / Markdown document
  const generateMarkdownPrompt = () => {
    const ob = client.onboarding;

    return `# DOSSIER DE CONTENIDO PARA SITIO WEB: ${client.fullName}
Proyecto: ${client.id}
Profesión: ${client.profession}
Ubicación: ${client.city}, ${client.country}
Dominio: ${client.primaryDomain || 'A definir'}

---

## 1. IDENTIDAD & HEADER
- **Nombre en la web:** ${ob?.personal.preferredName || client.commercialName || client.fullName}
- **Profesión / Titular:** ${ob?.personal.profession || client.profession}
- **Especialidad:** ${ob?.personal.specialty || client.specialties.join(', ') || 'Profesional'}
- **Foto:** ${ob?.personal.photoUrl || client.photoUrl || 'Usar avatar/placeholder limpio'}

## 2. PRESENTACIÓN & HISTORIA
- **Bio / Slogan:** "${ob?.story.presentation || client.bio || 'Profesional enfocado en brindar soluciones de alto nivel.'}"
- **Trayectoria:**
${
  ob?.story.experiences && ob.story.experiences.length > 0
    ? ob.story.experiences.map((e) => `  * ${e.role} en ${e.place} (${e.year}): ${e.description}`).join('\n')
    : '  * No especificada.'
}
- **Formación:**
${
  ob?.story.education && ob.story.education.length > 0
    ? ob.story.education.map((ed) => `  * ${ed.career} — ${ed.institution} (${ed.year})`).join('\n')
    : '  * No especificada.'
}

## 3. SERVICIOS & OFERTA
${
  ob?.offer.services && ob.offer.services.length > 0
    ? ob.offer.services
        .map((s, i) => `### Servicio ${i + 1}: ${s.name}\n${s.description || 'Sin descripción adicional.'}`)
        .join('\n\n')
    : 'Servicios generales de ' + client.profession
}

${
  ob?.offer.specialties && ob.offer.specialties.length > 0
    ? `**Especialidades destacadas:** ${ob.offer.specialties.join(', ')}`
    : ''
}

## 4. CONTACTO & REDES
- **Canal preferido:** ${ob?.contact.primaryContactMethod || 'WhatsApp'}
- **WhatsApp:** ${ob?.contact.whatsapp || client.whatsapp || 'No indicado'}
- **Email:** ${ob?.contact.email || client.email || 'No indicado'}
- **Instagram:** ${ob?.contact.instagram || client.instagram || 'No indicado'}
- **LinkedIn:** ${ob?.contact.linkedin || client.linkedin || 'No indicado'}
- **Ubicación:** ${ob?.contact.city || client.city}, ${ob?.contact.country || client.country}

## 5. DIRECCIÓN DE ARTE & ESTILO
- **Sensación / Mood:** ${ob?.style.moodTags.join(', ') || 'Profesional, Minimalista'}
- **Logo:** ${ob?.style.hasLogo ? `Sí (URL: ${ob.style.logoUrl || 'Pendiente'})` : 'No, usar tipografía limpia'}
- **Paleta / Colores:** ${ob?.style.customColorNotes || (ob?.style.colors.length ? ob.style.colors.join(', ') : 'Monocromo & Neutro (#18181B, #FAFAFA)')}
- **Referencias Web:** ${ob?.style.referenceUrls.join(', ') || 'Ninguna'}
- **Lo que NO quiere:** ${ob?.style.negativePreferences || 'Nada especificado'}
`;
  };

  const generateJsonPayload = () => {
    return JSON.stringify(
      {
        clientId: client.id,
        fullName: client.fullName,
        commercialName: client.commercialName,
        profession: client.profession,
        email: client.email,
        whatsapp: client.whatsapp,
        primaryDomain: client.primaryDomain,
        content: client.content,
        onboarding: client.onboarding,
      },
      null,
      2
    );
  };

  const activeContent = activeTab === 'prompt' ? generateMarkdownPrompt() : generateJsonPayload();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], {
      type: activeTab === 'prompt' ? 'text/markdown' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.id}-${client.fullName.toLowerCase().replace(/\s+/g, '-')}.${
      activeTab === 'prompt' ? 'md' : 'json'
    }`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Exportar Contenido de la Web — ${client.fullName}`}
      subtitle="Generá el dossier completo con las respuestas del cliente listo para crear su sitio web."
      maxWidth="3xl"
    >
      <div className="space-y-4 pt-2">
        {/* Format Selector */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'prompt'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Prompt / Markdown
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'json'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              Estructura JSON
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Descargar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? '¡Copiado!' : 'Copiar todo'}
            </Button>
          </div>
        </div>

        {/* Code/Text Viewer */}
        <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-200 max-h-96 overflow-y-auto whitespace-pre-wrap select-all leading-relaxed">
          {activeContent}
        </div>

        <p className="text-[11px] text-zinc-500">
          Tip: Podés copiar este contenido para pasárselo a cualquier generador de código o pegarlo directamente en el
          repositorio del cliente.
        </p>
      </div>
    </Modal>
  );
};
