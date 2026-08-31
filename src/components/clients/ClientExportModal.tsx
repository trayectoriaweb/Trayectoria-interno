import React, { useState } from 'react';
import { Client } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Copy, Check, FileJson, FileText, Sparkles, Download, Code2, CheckCircle2 } from 'lucide-react';

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

  // Safely extract client data merging onboarding and content structures
  const ob = client.onboarding;
  const ct = client.content || ({} as any);

  const preferredName =
    ob?.personal?.preferredName ||
    ob?.personal?.brandName ||
    ct?.identity?.name ||
    client.commercialName ||
    client.fullName;

  const profession = ob?.personal?.profession || ct?.identity?.profession || client.profession;
  const specialty =
    ob?.personal?.specialty ||
    ct?.presentation?.shortDescription ||
    client.specialties?.join(', ') ||
    'Profesional Independiente';

  const bio =
    ob?.story?.presentation ||
    ct?.presentation?.bio ||
    client.bio ||
    'Profesional con amplia trayectoria enfocado en brindar resultados excepcionales a sus clientes.';

  const mainSlogan = ct?.presentation?.mainSlogan || preferredName;

  // Services
  const services = (ob?.offer?.services && ob.offer.services.length > 0)
    ? ob.offer.services.map((s) => ({ name: s.name, description: s.description || '', price: '' }))
    : (ct?.services?.items && ct.services.items.length > 0)
    ? ct.services.items.map((s: any) => ({ name: s.name || s.title, description: s.description || '', price: s.price || '' }))
    : [{ name: `Servicios de ${profession}`, description: 'Atención personalizada y asesoramiento integral.', price: '' }];

  // Experiences
  const experiences = (ob?.story?.experiences && ob.story.experiences.length > 0)
    ? ob.story.experiences.map((e) => ({ role: e.role, place: e.place, year: e.year, description: e.description }))
    : (ct?.experience?.items && ct.experience.items.length > 0)
    ? ct.experience.items.map((e: any) => ({ role: e.role, place: e.company || e.place, year: e.period || e.year, description: e.description }))
    : [];

  // Education
  const education = (ob?.story?.education && ob.story.education.length > 0)
    ? ob.story.education.map((ed) => ({ career: ed.career, institution: ed.institution, year: ed.year }))
    : (ct?.education?.items && ct.education.items.length > 0)
    ? ct.education.items.map((ed: any) => ({ career: ed.degree || ed.career, institution: ed.institution, year: ed.year }))
    : [];

  // Portfolio
  const portfolio = (ob?.offer?.projects && ob.offer.projects.length > 0)
    ? ob.offer.projects.map((p) => ({ title: p.name || (p as any).title, description: p.description, year: p.year, url: p.url }))
    : (ct?.portfolio?.items && ct.portfolio.items.length > 0)
    ? ct.portfolio.items.map((p: any) => ({ title: p.title || p.name, description: p.description, year: p.year, url: p.link || p.url }))
    : [];

  // Contact
  const contact = {
    whatsapp: ob?.contact?.whatsapp || ct?.contact?.whatsapp || client.whatsapp || '',
    email: ob?.contact?.email || ct?.contact?.email || client.email || '',
    instagram: ob?.contact?.instagram || ct?.contact?.instagram || client.instagram || '',
    linkedin: ob?.contact?.linkedin || ct?.contact?.linkedin || client.linkedin || '',
    city: ob?.contact?.city || ct?.contact?.location || client.city || 'Buenos Aires',
    country: ob?.contact?.country || client.country || 'Argentina',
    primaryChannel: ob?.contact?.primaryContactMethod || 'whatsapp',
  };

  // Visual Style
  const moodTags = ob?.style?.moodTags?.length
    ? ob.style.moodTags.join(', ')
    : 'Profesional, Minimalista, Elegante, Confiable, Alta Conversión';

  const colors = ob?.style?.customColorNotes || (ob?.style?.colors?.length
    ? ob.style.colors.join(', ')
    : ct?.identity?.colors?.length
    ? ct.identity.colors.join(', ')
    : 'Azul Klein (#0033FF), Blanco cálido (#FAFAFA), Grafito (#18181B)');

  const negativePreferences = ob?.style?.negativePreferences || 'No usar fondos negros pesados, no usar textos excesivamente largos, evitar interfaces genéricas.';
  const referenceUrls = ob?.style?.referenceUrls?.length ? ob.style.referenceUrls.join(', ') : 'Ninguno especificado.';

  // GENERATE THE MASTER PROMPT FOR AI
  const generateMarkdownPrompt = () => {
    return `# 🚀 MEGA PROMPT PARA CREAR SITIO WEB DE ALTA CONVERSIÓN

Actúa como un **Diseñador Web UI/UX Senior y Desarrollador Frontend Experto** (especializado en Astro, HTML5 semántico, Tailwind CSS y diseño editorial contemporáneo).

Tu tarea es construir el sitio web profesional completo, optimizado para móvil y de alta conversión para el siguiente cliente en 72hs.

---

## 👤 FICHA DEL CLIENTE & MARCA
- **Nombre en el Sitio:** ${preferredName}
- **Titular / Profesión:** ${profession}
- **Especialidad Principal:** ${specialty}
- **Ubicación:** ${contact.city}, ${contact.country}
- **Dominio Asignado:** ${client.primaryDomain || `${preferredName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`}
- **Canal de Conversión Principal:** ${contact.primaryChannel.toUpperCase()} (El botón de acción más visible debe dirigir a este canal)

---

## ✍️ COPYWRITING & CONTENIDO

### Slogan / Propuesta de Valor
> "${mainSlogan}"

### Biografía y Presentación
"${bio}"

### Servicios a Destacar (${services.length})
${services
  .map(
    (s, idx) => `
#### ${idx + 1}. ${s.name}
- **Descripción:** ${s.description || 'Asesoramiento y servicio integral personalizado.'}
${s.price ? `- **Inversión / Honorarios:** ${s.price}` : ''}
`
  )
  .join('')}

${
  experiences.length > 0
    ? `### Trayectoria & Experiencia Laboral
${experiences.map((e) => `- **${e.role}** en *${e.place}* (${e.year})${e.description ? `: ${e.description}` : ''}`).join('\n')}`
    : ''
}

${
  education.length > 0
    ? `### Formación & Certificaciones
${education.map((ed) => `- **${ed.career}** — *${ed.institution}* (${ed.year})`).join('\n')}`
    : ''
}

${
  portfolio.length > 0
    ? `### Portfolio & Casos Destacados
${portfolio.map((p) => `- **${p.title}** (${p.year || 'Reciente'}): ${p.description || 'Proyecto destacado'}${p.url ? ` | Link: ${p.url}` : ''}`).join('\n')}`
    : ''
}

### Información de Contacto y Enlaces
- **WhatsApp:** ${contact.whatsapp ? `${contact.whatsapp} (Generar link directo: https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(preferredName)},%20te%20contacto%20desde%20tu%20sitio%20web)` : 'No especificado'}
- **Email:** ${contact.email ? `${contact.email}` : 'No especificado'}
- **Instagram:** ${contact.instagram ? `@${contact.instagram.replace('@', '')}` : 'No especificado'}
- **LinkedIn:** ${contact.linkedin || 'No especificado'}
- **Ubicación:** ${contact.city}, ${contact.country}

---

## 🎨 DIRECCIÓN DE ARTE & LINEAMIENTOS VISUALES
- **Sensación / Mood:** ${moodTags}
- **Paleta de Colores:** ${colors}
- **Tipografía Recomendada:** Plus Jakarta Sans (Headers y Body) con acentos limpios.
- **Sitios de Referencia / Inspiración:** ${referenceUrls}
- ⚠️ **REGLA DE ORO (Lo que NO quiere el cliente):** ${negativePreferences}

---

## 📐 ARQUITECTURA DE PÁGINA REQUERIDA (SECCIONES)

1. **Header / Navbar:**
   - Nombre de marca limpio + indicador de disponibilidad en vivo.
   - Enlaces a secciones (Sobre mí, Servicios, Trayectoria, Contacto).
   - Botón CTA destacado a WhatsApp.

2. **Hero Section (Impacto Inmediato):**
   - Badge de especialidad (${specialty}).
   - Titular de alta conversión con el nombre y propuesta de valor.
   - Subtítulo explicativo conciso.
   - 2 Botones de acción: Primario (WhatsApp directo) + Secundario (Ver servicios / casos).
   - Indicadores de confianza (Ubicación, años de experiencia o matrículas).

3. **Sección de Servicios:**
   - Cards con microinteracciones sutiles (hover limpio, borders sutiles).
   - Título claro, párrafo descriptivo y botón directo para consultar sobre ese servicio.

4. **Sobre Mí & Trayectoria:**
   - Bio escrita en primera o tercera persona según el tono.
   - Grid o timeline con experiencia y formación académica.

5. **Casos / Portfolio (si aplica):**
   - Tarjetas elegantes con descripción del trabajo realizado.

6. **Sección Final de Conversión (Footer / CTA):**
   - Bloque de cierre con llamada a la acción clara para iniciar contacto.
   - Datos directos de WhatsApp, Email y Redes.
   - Copyright © ${new Date().getFullYear()} ${preferredName}. Diseñado por Trayectoria.

---

## 💻 REQUISITOS TÉCNICOS DE CÓDIGO
- Genera código completo, modular y listo para producción.
- 100% responsivo (Mobile-first, probado para pantallas de 375px a 1920px).
- Usa Tailwind CSS para el estilado con clases limpias y modernas.
- Asegura accesibilidad (WCAG 2.1 AA) y SEO con OpenGraph tags y Schema.org LocalBusiness/Person.
`;
  };

  const handleCopy = () => {
    const text = activeTab === 'prompt' ? generateMarkdownPrompt() : JSON.stringify({ clientId: client.id, fullName: client.fullName, profession: client.profession, content: client.content, onboarding: client.onboarding }, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const text = activeTab === 'prompt' ? generateMarkdownPrompt() : JSON.stringify({ clientId: client.id, fullName: client.fullName, profession: client.profession, content: client.content, onboarding: client.onboarding }, null, 2);
    const filename = `${client.id}-${client.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_')}-prompt.md`;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ Prompt Maestro para Construcción Web con IA"
      subtitle="Dossier completo estructurado listo para pegar en Claude, ChatGPT o Antigravity."
      maxWidth="2xl"
    >
      <div className="space-y-4 pt-2">
        {/* Banner with One-Click Copy Action */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#0033FF] text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-zinc-900 font-display">
                Prompt Listo para Pegar en tu IA
              </h4>
            </div>
            <p className="text-xs text-zinc-600">
              Contiene toda la información del cliente, servicios, bio, colores y arquitectura web estructurada.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0033FF] hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Prompt Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Mega Prompt
                </>
              )}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              icon={<Download className="w-3.5 h-3.5" />}
              title="Descargar archivo Markdown"
            >
              Descargar .md
            </Button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'prompt'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Prompt Markdown Formateado
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'json'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              Payload JSON Crudo
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-400">
            {preferredName} • {client.id}
          </span>
        </div>

        {/* Code / Text Preview */}
        <div className="relative">
          <textarea
            readOnly
            value={activeTab === 'prompt' ? generateMarkdownPrompt() : JSON.stringify({ clientId: client.id, fullName: client.fullName, profession: client.profession, content: client.content, onboarding: client.onboarding }, null, 2)}
            rows={14}
            className="w-full text-xs font-mono p-4 rounded-xl border border-zinc-200 bg-zinc-950 text-zinc-100 focus:outline-none selection:bg-blue-600 selection:text-white leading-relaxed resize-y"
          />
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            Optimizado para Astro + Tailwind CSS y diseño editorial
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
