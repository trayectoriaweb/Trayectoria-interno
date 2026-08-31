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

  const ob = (client.onboarding || {}) as any;
  const ct = (client.content || {}) as any;

  // Check if client is a business or professional
  const isBusiness =
    client.contractedProduct?.toLowerCase().includes('negocio') ||
    client.contractedProduct?.toLowerCase().includes('comercio') ||
    ct?.serviceType === 'custom_business' ||
    Boolean(ct?.businessInfo?.nombreNegocio);

  const biz = ct?.businessInfo || {};

  const preferredName = isBusiness
    ? biz.nombreNegocio || client.commercialName || client.fullName
    : ob?.personal?.preferredName ||
      ob?.personal?.brandName ||
      ct?.identity?.name ||
      client.commercialName ||
      client.fullName;

  const profession = isBusiness
    ? biz.rubro || 'Comercio & Local'
    : ob?.personal?.profession || ct?.identity?.profession || client.profession;

  const specialty = isBusiness
    ? biz.rubro || 'Atención al público y catálogo'
    : ob?.personal?.specialty ||
      ct?.presentation?.shortDescription ||
      client.specialties?.join(', ') ||
      'Profesional Independiente';

  const bio = isBusiness
    ? biz.descripcionNegocio || 'Comercio enfocado en brindar la mejor calidad, atención y productos a sus clientes.'
    : ob?.story?.presentation ||
      ct?.presentation?.bio ||
      client.bio ||
      'Profesional con amplia trayectoria enfocado en brindar resultados excepcionales a sus clientes.';

  const mainSlogan = isBusiness
    ? biz.slogan || biz.ganchoComercial || preferredName
    : ct?.presentation?.mainSlogan || preferredName;

  // Services / Products
  const rawServices = isBusiness
    ? biz.serviciosProductos || []
    : (ob?.offer?.services && ob.offer.services.length > 0)
    ? ob.offer.services
    : (ct?.services?.items && ct.services.items.length > 0)
    ? ct.services.items
    : [];

  const services = rawServices.length > 0
    ? rawServices.map((s: any) => ({
        name: s.name || s.nombre || s.title,
        description: s.description || s.descripcion || '',
        price: s.price || s.precio || '',
      }))
    : [{ name: `Servicios de ${profession}`, description: 'Atención personalizada y asesoramiento integral.', price: '' }];

  // Experiences & Education (for professionals)
  const experiences = (ob?.story?.experiences && ob.story.experiences.length > 0)
    ? ob.story.experiences.map((e: any) => ({ role: e.role, place: e.place, year: e.year, description: e.description }))
    : (ct?.experience?.items && ct.experience.items.length > 0)
    ? ct.experience.items.map((e: any) => ({ role: e.role, place: e.company || e.place, year: e.period || e.year, description: e.description }))
    : [];

  const education = (ob?.story?.education && ob.story.education.length > 0)
    ? ob.story.education.map((ed: any) => ({ career: ed.career, institution: ed.institution, year: ed.year }))
    : (ct?.education?.items && ct.education.items.length > 0)
    ? ct.education.items.map((ed: any) => ({ career: ed.degree || ed.career, institution: ed.institution, year: ed.year }))
    : [];

  // Portfolio / Projects
  const portfolio = (ob?.offer?.projects && ob.offer.projects.length > 0)
    ? ob.offer.projects.map((p: any) => ({ title: p.name || p.title, description: p.description, year: p.year, url: p.url }))
    : (ct?.portfolio?.items && ct.portfolio.items.length > 0)
    ? ct.portfolio.items.map((p: any) => ({ title: p.title || p.name, description: p.description, year: p.year, url: p.link || p.url }))
    : [];

  // Contact & Location
  const contact = {
    whatsapp: isBusiness ? (biz.whatsapp || client.whatsapp || '') : (ob?.contact?.whatsapp || ct?.contact?.whatsapp || client.whatsapp || ''),
    email: isBusiness ? (biz.email || client.email || '') : (ob?.contact?.email || ct?.contact?.email || client.email || ''),
    instagram: isBusiness ? (biz.instagram || client.instagram || '') : (ob?.contact?.instagram || ct?.contact?.instagram || client.instagram || ''),
    linkedin: isBusiness ? '' : (ob?.contact?.linkedin || ct?.contact?.linkedin || client.linkedin || ''),
    city: isBusiness ? (biz.ciudad || client.city || 'Buenos Aires') : (ob?.contact?.city || ct?.contact?.location || client.city || 'Buenos Aires'),
    country: client.country || 'Argentina',
    address: isBusiness ? (biz.direccion || '') : (ob?.contact?.address || ct?.contact?.location || ''),
    mapsUrl: isBusiness ? (biz.googleMapsUrl || '') : (ob?.contact?.googleMapsUrl || ct?.contact?.googleMapsUrl || ''),
    primaryChannel: isBusiness ? (biz.canalPrincipal || 'whatsapp') : (ob?.contact?.primaryContactMethod || 'whatsapp'),
    hours: isBusiness ? biz.horarios : null,
    promo: isBusiness ? biz.promociones : null,
    hook: isBusiness ? biz.ganchoComercial : null,
  };

  // Visual Style
  const moodTags = ob?.style?.moodTags?.length
    ? ob.style.moodTags.join(', ')
    : 'Profesional, Moderno, Confiable, Alta Conversión, Visualmente Limpio';

  const colors = isBusiness
    ? biz.colorPrincipal ? `${biz.colorPrincipal.name} (${biz.colorPrincipal.hex})` : 'Azul Klein (#0033FF)'
    : ob?.style?.customColorNotes || (ob?.style?.colors?.length
    ? ob.style.colors.join(', ')
    : ct?.identity?.colors?.length
    ? ct.identity.colors.join(', ')
    : 'Azul Klein (#0033FF), Blanco cálido (#FAFAFA), Grafito (#18181B)');

  const negativePreferences = isBusiness
    ? biz.loQueNoQuiere || 'Evitar fondos oscuros pesados, interfaces lentas o textos excesivamente largos.'
    : ob?.style?.negativePreferences || 'No usar fondos negros pesados, no usar textos excesivamente largos, evitar interfaces genéricas.';

  const referenceUrls = ob?.style?.referenceUrls?.length ? ob.style.referenceUrls.join(', ') : 'Ninguno especificado.';

  // GENERATE THE MASTER PROMPT FOR AI WITH ADVANCED SEO & PERSUASIVE COPYWRITING
  const generateMarkdownPrompt = () => {
    return `# 🚀 MEGA PROMPT: SITIO WEB DE ALTA CONVERSIÓN & SEO AVANZADO (72 HS)

Actúa como un **Lead Frontend Architect, Copywriter de Respuesta Directa y Especialista en SEO Técnico & Local Senior** (especializado en Astro / HTML5 semántico, Tailwind CSS y diseño editorial contemporáneo).

Tu misión es programar y redactar el sitio web completo, con **redacción persuasiva dirigida al avatar/cliente ideal**, **SEO técnico y local optimizado para primeras posiciones en Google**, y una tasa de conversión máxima hacia el canal de contacto.

---

## 👤 1. FICHA DEL CLIENTE & ESTRATEGIA DE MARCA
- **Tipo de Proyecto:** ${isBusiness ? '🏢 Web Comercial para Negocio / Local Físico' : '✦ Web de Autoridad para Profesional Independiente'}
- **Nombre en el Sitio:** ${preferredName}
- **Rubro / Profesión:** ${profession}
- **Especialidad / Enfoque:** ${specialty}
- **Ciudad & País:** ${contact.city}, ${contact.country} ${contact.address ? `(Dirección: ${contact.address})` : ''}
- **Dominio Asignado:** ${client.primaryDomain || `${preferredName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`}
- **Canal de Conversión Principal:** **${contact.primaryChannel.toUpperCase()}** (El botón principal flotante y de acción debe dirigir inmediatamente aquí).
${contact.hours ? `- **Horarios de Atención:** L-V: ${contact.hours.lunesViernes || 'Consultar'}, Sáb: ${contact.hours.sabados || 'Consultar'}, Dom: ${contact.hours.domingosFeriados || 'Cerrado'}` : ''}
${contact.mapsUrl ? `- **Enlace a Google Maps:** ${contact.mapsUrl}` : ''}
${contact.promo ? `- **Promoción / Oferta Vigente:** ${contact.promo}` : ''}
${contact.hook ? `- **Gancho Comercial:** "${contact.hook}"` : ''}

---

## 🎯 2. COPYWRITING PERSUASIVO & DEFINICIÓN DEL AVATAR (CLIENTE IDEAL)

### Perfil del Cliente Ideal (Buyer Persona)
- **¿Quién es?:** Persona o empresa en **${contact.city} y alrededores** que busca resolver una necesidad urgente o específica vinculada a **${profession}**.
- **Dolores & Frustraciones actuales:** Miedo a perder tiempo o dinero con servicios informales, falta de claridad en precios o procesos, dificultad para conseguir turnos/atención rápida, o malas experiencias pasadas.
- **Deseos & Objetivos:** Encontrar a un referente confiable, profesional y cercano que le brinde soluciones claras, respuesta inmediata por WhatsApp y un trato de excelencia.
- **Tono de Comunicación:** Cercano pero sumamente profesional, seguro, empático y orientado a la acción (Fórmula PAS: *Problema -> Agitación -> Solución*).

### Copywriting por Secciones
- **Slogan / Propuesta de Valor Central:**
  > "${mainSlogan}"
- **Historia / Presentación:**
  "${bio}"
- **Servicios / Oferta (${services.length} items):**
${services
  .map(
    (s: any, idx: number) => `  ${idx + 1}. **${s.name}**
     - *Beneficio para el cliente:* ${s.description || 'Solución integral personalizada con atención dedicada.'}
     ${s.price ? `- *Inversión:* ${s.price}` : ''}`
  )
  .join('\n')}

---

## 🔍 3. ESPECIFICACIONES DE SEO AVANZADO (TÉCNICO, LOCAL & ON-PAGE)

Debes incluir en el código HTML/Head todas las siguientes optimizaciones de nivel profesional:

### A. Meta Tags & Snippet de Google (CTR Optimizado)
\`\`\`html
<title>${profession} en ${contact.city} | ${preferredName}</title>
<meta name="description" content="${preferredName} en ${contact.city}. ${specialty}. ${mainSlogan.substring(0, 80)}. ¡Consultá ahora por WhatsApp y coordiná tu atención!" />
<link rel="canonical" href="https://${client.primaryDomain || `${preferredName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`}/" />
<meta name="robots" content="index, follow" />
\`\`\`

### B. Open Graph & Twitter Cards (Para compartir en WhatsApp, Instagram y LinkedIn)
\`\`\`html
<meta property="og:locale" content="es_AR" />
<meta property="og:type" content="${isBusiness ? 'business.business' : 'profile'}" />
<meta property="og:title" content="${profession} en ${contact.city} | ${preferredName}" />
<meta property="og:description" content="${mainSlogan}" />
<meta property="og:url" content="https://${client.primaryDomain || `${preferredName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`}/" />
<meta property="og:site_name" content="${preferredName}" />
<meta name="twitter:card" content="summary_large_image" />
\`\`\`

### C. Marcado Estructurado Schema.org JSON-LD (Rich Snippets para Google)
Incluye obligatoriamente el siguiente script en el \`<head>\`:
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${isBusiness ? 'LocalBusiness' : 'ProfessionalService'}",
  "name": "${preferredName}",
  "description": "${bio.replace(/"/g, '\\"')}",
  "url": "https://${client.primaryDomain || `${preferredName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`}/",
  "telephone": "${contact.whatsapp}",
  "email": "${contact.email}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${contact.address || 'Zona céntrica'}",
    "addressLocality": "${contact.city}",
    "addressCountry": "AR"
  },
  ${contact.mapsUrl ? `"hasMap": "${contact.mapsUrl}",` : ''}
  "priceRange": "$$",
  "sameAs": [
    ${contact.instagram ? `"https://instagram.com/${contact.instagram.replace('@', '')}"` : ''}
  ]
}
</script>
\`\`\`

### D. Preguntas Frecuentes con FAQPage Schema
Genera una sección de **4 a 5 Preguntas Frecuentes (FAQ)** respondiendo a las principales objeciones del avatar (medios de pago, cómo coordinar un turno o pedido, tiempos de respuesta, ubicación) e incluye el bloque Schema.org \`FAQPage\` correspondiente.

### E. Jerarquía de Encabezados (H1, H2, H3)
- **H1 único:** Debe contener la keyword de mayor volumen de búsqueda transaccional (ej: *"${profession} en ${contact.city} — ${preferredName}"*).
- **H2:** Enfocados en palabras clave secundarias e intenciones de búsqueda (ej: *"Nuestros Servicios de ${specialty}"*, *"Por qué elegirnos"*, *"Ubicación y Horarios de Atención"*, *"Preguntas Frecuentes"*).
- **H3:** Títulos de cada servicio o producto individual.

---

## 🎨 4. DIRECCIÓN DE ARTE & IDENTIDAD VISUAL
- **Paleta de Color Principal:** **${colors}** (Usar como color primario y acento de botones).
- **Sensación / Vibra:** ${moodTags}
- **Tipografía Recomendada:** Plus Jakarta Sans o Inter (limpia, moderna, excelente legibilidad en mobile).
- **Inspiración:** ${referenceUrls}
- ⚠️ **LO QUE NO QUIERE EL CLIENTE (Prohibido usar):** ${negativePreferences}

---

## 📐 5. ESTRUCTURA DE LA PÁGINA (MOBILE-FIRST)

1. **Header Fijo / Sticky:** Logotipo tipográfico moderno + badge "🟢 Disponible hoy" + botón CTA directo a WhatsApp.
2. **Hero Section de Alto Impacto:**
   - Pill con la especialidad destacada.
   - Titular principal H1 irresistible orientado a beneficios.
   - Subtítulo que derriba la principal objeción del cliente.
   - 2 Botones: Principal (WhatsApp directo con mensaje prearmado) y Secundario (Ver servicios).
   - Métricas de confianza (Años de trayectoria, clientes atendidos o ubicación).
3. **Sección de Propuesta de Valor (Dolor -> Solución):** 3 pilares clave de por qué el cliente debe elegir este servicio.
4. **Catálogo de Servicios / Productos (${services.length} items):**
   - Tarjetas con microinteracción hover, descripción clara y botón individual "Consultar por este servicio".
5. ${isBusiness ? '**Local Físico, Horarios & Mapa:** Dirección completa, botón para abrir en Google Maps y tabla de horarios semanales.' : '**Trayectoria & Autoridad:** Bio profesional, años de experiencia y credenciales destacadas.'}
6. **Sección FAQ (Preguntas Frecuentes):** Acordeón interactivo con Schema FAQPage para rich snippets.
7. **Banner Final de Conversión (CTA):** Llamado a la acción con gancho fuerte ("${contact.hook || '¿Listo para dar el siguiente paso? Escribinos por WhatsApp'}") y botón prominente.
8. **Botón Flotante de WhatsApp:** Con animación sutil de pulso en la esquina inferior derecha.

---

## 💻 6. REGLAS DE ENTREGA DE CÓDIGO
- Entrega el código **completo, funcional y sin placeholders** en un único archivo HTML con Tailwind CSS (vía CDN o clases estándar) y Vanilla JS.
- **Rendimiento Máximo:** Todas las imágenes con atributos \`alt\` descriptivos, \`width\`, \`height\` y \`loading="lazy"\`.
- Enlaces de WhatsApp configurados con la API oficial: \`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(preferredName)},%20te%20contacto%20desde%20tu%20sitio%20web\`
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
