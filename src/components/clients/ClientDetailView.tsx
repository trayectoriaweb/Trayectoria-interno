import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  MessageCircle,
  Mail,
  Instagram,
  Linkedin,
  MapPin,
  Clock,
  DollarSign,
  FolderKanban,
  Globe,
  Network,
  CheckSquare,
  History,
  FileText,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  GitBranch,
  Server,
} from 'lucide-react';
import { db, calculateContentCompleteness, getDomainExpirationInfo } from '../../services/db/repository';
import { Client, Project, WebSite, Domain, Task, ChecklistItem } from '../../types';
import { Button } from '../common/Button';
import { StatusPill } from '../common/StatusPill';
import { DomainAlertBadge } from '../domains/DomainAlertBadge';
import { ClientFormModal } from './ClientFormModal';
import { ActivityModal } from '../activity/ActivityModal';

interface ClientDetailViewProps {
  clientId: string;
  onBack: () => void;
  onNavigateSection?: (section: any) => void;
  onOpenOnboarding?: (clientId: string) => void;
}

type TabType =
  | 'overview'
  | 'onboarding'
  | 'professional'
  | 'commercial'
  | 'technical'
  | 'content'
  | 'checklist'
  | 'activity'
  | 'notes';

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  clientId,
  onBack,
  onOpenOnboarding,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const client = db.getClientById(clientId);
  const projects = db.getProjectsByClient(clientId);
  const webs = db.getWebsByClient(clientId);
  const domains = db.getDomainsByClient(clientId);
  const activityLogs = db.getActivityLogsByClient(clientId);
  const notes = db.getNotesByClient(clientId);
  const tasks = db.getTasks().filter((t) => t.clientId === clientId);

  if (!client) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500">Cliente no encontrado (ID: {clientId})</p>
        <Button variant="outline" size="sm" onClick={onBack} className="mt-4">
          Volver al Directorio
        </Button>
      </div>
    );
  }

  const primaryProject = projects[0];
  const contentCompleteness = calculateContentCompleteness(client.content);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    db.addNote(client.id, newNoteText.trim(), 'Operaciones Trayectoria');
    setNewNoteText('');
  };

  const handleToggleChecklistItem = (itemId: string) => {
    if (!primaryProject) return;
    const updatedChecklist = primaryProject.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    db.updateProject(primaryProject.id, { checklist: updatedChecklist });
  };

  const handleToggleContentSection = (sectionKey: keyof Client['content']) => {
    const currentSection = client.content[sectionKey];
    const updatedContent = {
      ...client.content,
      [sectionKey]: {
        ...currentSection,
        isComplete: !currentSection.isComplete,
      },
    };
    db.updateClient(client.id, { content: updatedContent });
  };

  const tabs: { id: TabType; label: string; icon: any; count?: number; badge?: string }[] = [
    { id: 'overview', label: 'Resumen Operativo', icon: Layers },
    {
      id: 'onboarding',
      label: 'Onboarding Cliente',
      icon: Sparkles,
      badge: client.onboardingStatus || (client.onboarding?.progressPercentage ? `${client.onboarding.progressPercentage}%` : 'Link'),
    },
    { id: 'professional', label: 'Info Profesional', icon: FileText },
    { id: 'commercial', label: 'Info Comercial', icon: DollarSign },
    { id: 'technical', label: 'Ficha Técnica', icon: Server },
    {
      id: 'content',
      label: 'Contenido Web',
      icon: Sparkles,
      badge: contentCompleteness.isComplete ? '✓' : `${contentCompleteness.percentage}%`,
    },
    { id: 'checklist', label: 'Checklist Proyecto', icon: CheckSquare },
    { id: 'activity', label: 'Historial / Actividad', icon: History, count: activityLogs.length },
    { id: 'notes', label: 'Notas Internas', icon: Lock, count: notes.length },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-150">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al Directorio de Clientes
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            icon={<Edit className="w-3.5 h-3.5" />}
          >
            Editar Ficha
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsActivityModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            + Registrar Actividad
          </Button>
        </div>
      </div>

      {/* Main Client Identity Dossier Card */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            {client.photoUrl ? (
              <img
                src={client.photoUrl}
                alt={client.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-zinc-200 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 text-white font-bold text-xl sm:text-2xl flex items-center justify-center shrink-0">
                {client.fullName.charAt(0)}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                  {client.id}
                </span>
                <StatusPill status={client.status} size="md" />
                <span className="text-xs text-zinc-400 font-mono">Alta: {client.createdAt}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
                {client.fullName}
              </h2>

              <p className="text-sm font-medium text-zinc-600">
                {client.commercialName ? `${client.commercialName} • ` : ''}
                {client.profession}
              </p>

              <p className="text-xs text-zinc-500 flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {client.city}, {client.country}
                <span className="text-zinc-300">•</span>
                <span>Último contacto: {client.lastContact}</span>
              </p>
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
            {/* Onboarding Quick Action */}
            <button
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}#/onboarding/${client.id}`;
                navigator.clipboard.writeText(url);
                alert(`¡Enlace copiado para ${client.fullName}!\n\n${url}`);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 text-xs font-semibold transition-colors shadow-2xs"
              title="Copiar enlace de onboarding para enviar al cliente"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Copiar Link Onboarding
            </button>

            {onOpenOnboarding && (
              <button
                onClick={() => onOpenOnboarding(client.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition-colors"
                title="Abrir vista de onboarding de este cliente"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                Probar Onboarding
              </button>
            )}

            {client.whatsapp && (
              <a
                href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
            )}
            {client.email && (
              <a
                href={`mailto:${client.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Email
              </a>
            )}
            {client.instagram && (
              <a
                href={`https://instagram.com/${client.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-zinc-500" />
                Instagram
              </a>
            )}
            {client.linkedin && (
              <a
                href={`https://${client.linkedin.replace('https://', '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-zinc-500" />
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-8 border-t border-zinc-100 pt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      tab.badge === '✓'
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-zinc-800 text-amber-300'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB: ONBOARDING CLIENTE */}
      {activeTab === 'onboarding' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Dossier de Onboarding del Cliente
              </h3>
              <p className="text-xs text-zinc-500">
                Información y preferencias enviadas por el cliente a través de su enlace personal guiado.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const url = `${window.location.origin}${window.location.pathname}#/onboarding/${client.id}`;
                  navigator.clipboard.writeText(url);
                  alert(`¡Enlace copiado!\n\n${url}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Copiar Enlace
              </button>

              {onOpenOnboarding && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenOnboarding(client.id)}
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Abrir Onboarding
                </Button>
              )}
            </div>
          </div>

          {/* Onboarding Status Header Banner */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Estado del Onboarding
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    client.onboardingStatus === 'Información recibida'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : client.onboarding?.progressPercentage
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}
                >
                  {client.onboardingStatus || 'No iniciado'}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-700">
                  Progreso: {client.onboarding?.progressPercentage || 0}%
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-500 sm:text-right">
              {client.onboarding?.lastSavedAt && (
                <p>Último guardado: {new Date(client.onboarding.lastSavedAt).toLocaleString('es-AR')}</p>
              )}
              {client.onboarding?.completedAt && (
                <p className="text-emerald-700 font-medium">
                  Completado el: {new Date(client.onboarding.completedAt).toLocaleDateString('es-AR')}
                </p>
              )}
            </div>
          </div>

          {/* Detailed Responses Sections */}
          {client.onboarding ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Datos Personales & Nombre en Web */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
                  1. Sobre el Cliente & Nombre en Web
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Nombre Comercial / Web:</span>
                    <span className="font-bold text-zinc-900">
                      {client.onboarding.personal.preferredName || client.onboarding.personal.brandName || client.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Profesión & Especialidad:</span>
                    <span className="text-zinc-800">
                      {client.onboarding.personal.profession} — {client.onboarding.personal.specialty || 'General'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Foto Profesional:</span>
                    <span className="text-zinc-700">
                      {client.onboarding.personal.photoStatus === 'uploaded'
                        ? client.onboarding.personal.photoUrl
                          ? `Enlace: ${client.onboarding.personal.photoUrl}`
                          : 'Cargada'
                        : client.onboarding.personal.photoStatus === 'send_later'
                        ? 'La enviará después por WhatsApp'
                        : 'No tiene foto'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Presentación & Historia */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
                  2. Presentación & Historia
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Presentación / Bio:</span>
                    <p className="text-zinc-700 italic bg-zinc-50 p-2.5 rounded border border-zinc-100 mt-1">
                      "{client.onboarding.story.presentation || 'Sin presentación cargada'}"
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">
                      Experiencias ({client.onboarding.story.experiences.length}):
                    </span>
                    {client.onboarding.story.experiences.map((exp, i) => (
                      <span key={i} className="block text-zinc-800 font-medium">
                        • {exp.role} en {exp.place} ({exp.year})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Oferta & Servicios */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
                  3. Servicios & Portfolio
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Servicios Registrados:</span>
                    {client.onboarding.offer.services.map((srv, i) => (
                      <div key={i} className="mt-1 p-2 bg-zinc-50 rounded border border-zinc-100">
                        <strong className="text-zinc-900 block">{srv.name}</strong>
                        <span className="text-zinc-500 text-[11px]">{srv.description}</span>
                      </div>
                    ))}
                  </div>
                  {client.onboarding.offer.specialties.length > 0 && (
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase mt-2">Especialidades:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.onboarding.offer.specialties.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Estilo & Preferencias Visuales */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
                  4. Estilo & Preferencias Visuales
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Sensación / Mood:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.onboarding.style.moodTags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase mt-2">Colores / Paleta:</span>
                    <span className="text-zinc-800">
                      {client.onboarding.style.customColorNotes || 'Paleta estándar'}
                    </span>
                  </div>
                  {client.onboarding.style.referenceUrls.length > 0 && (
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase mt-2">Referencias Web:</span>
                      {client.onboarding.style.referenceUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline block truncate font-mono text-[11px]"
                        >
                          {url}
                        </a>
                      ))}
                    </div>
                  )}
                  {client.onboarding.style.negativePreferences && (
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase mt-2">Lo que NO quiere:</span>
                      <p className="text-rose-700 italic bg-rose-50 p-2 rounded border border-rose-100">
                        {client.onboarding.style.negativePreferences}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-zinc-200 rounded-xl space-y-3">
              <p className="text-xs text-zinc-500">
                Este cliente todavía no ha comenzado su proceso de onboarding interactivo.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}${window.location.pathname}#/onboarding/${client.id}`;
                  navigator.clipboard.writeText(url);
                  alert(`¡Enlace copiado para ${client.fullName}!\n\n${url}`);
                }}
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Copiar Enlace para enviárselo al Cliente
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: RESUMEN OPERATIVO */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Summary: Commercial & Technical Snapshot */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 font-display">
                Estado General del Cliente
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Servicio Contratado
                  </span>
                  <span className="text-sm font-bold text-zinc-900 mt-1 block">
                    {client.contractedProduct || 'Web Estándar'}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono mt-0.5 block">{client.price}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Dominio Principal
                  </span>
                  <span className="text-sm font-bold font-mono text-zinc-900 mt-1 block truncate">
                    {client.primaryDomain || 'No registrado'}
                  </span>
                  <span className="text-xs text-zinc-500 mt-0.5 block">
                    {client.domainRegistrar || 'NIC Argentina'}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Completitud Contenido
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-zinc-900 font-mono">
                      {contentCompleteness.percentage}%
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        contentCompleteness.isComplete ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {contentCompleteness.isComplete ? '✓ Listo' : '⚠ Faltan datos'}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">
                    {contentCompleteness.missingCount === 0
                      ? '7/7 secciones listas'
                      : `${contentCompleteness.missingCount} secciones pendientes`}
                  </span>
                </div>
              </div>

              {/* Bio snippet */}
              {client.bio && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                    Biografía Profesional
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50/60 p-3.5 rounded-lg border border-zinc-100">
                    {client.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Linked Projects and Webs */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 font-display">
                  Proyectos Web Vinculados
                </h3>
              </div>

              {projects.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No hay proyectos registrados para este cliente.</p>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {projects.map((proj) => (
                    <div key={proj.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-900">{proj.id}</span>
                          <span className="font-medium text-xs text-zinc-800">{proj.name}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Inicio: {proj.startDate} • Entrega estimada: {proj.estimatedDeliveryDate}
                        </p>
                      </div>
                      <StatusPill status={proj.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Summary: Internal Notes & Quick Reminders */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-tight uppercase text-zinc-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  Notas Internas Rápidas
                </h3>
                <span className="text-[10px] text-zinc-400">Privado</span>
              </div>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Escribí una nota privada sobre preferencias, comunicación..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" type="submit">
                    Guardar Nota
                  </Button>
                </div>
              </form>

              <div className="space-y-2 pt-2 max-h-64 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No hay notas internas registradas aún.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 text-xs">
                      <p className="text-zinc-800">{note.content}</p>
                      <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
                        {note.createdAt} • {note.author}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Tasks */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold tracking-tight uppercase text-zinc-900 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-zinc-500" />
                Tareas de este Cliente
              </h3>

              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No hay tareas pendientes.</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => db.toggleTask(task.id)}
                      className="p-2.5 rounded-lg border border-zinc-100 hover:bg-zinc-50 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            task.completed ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-3 h-3" />}
                        </span>
                        <span className={`truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>
                          {task.title}
                        </span>
                      </div>
                      <StatusPill status={task.priority} size="sm" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INFORMACIÓN PROFESIONAL */}
      {activeTab === 'professional' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="text-base font-bold text-zinc-900 font-display">
              Información Profesional & Curricular
            </h3>
            <p className="text-xs text-zinc-500">
              Datos que nutren el contenido editorial de su web, bio y presentación pública.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Profesión / Título
                </label>
                <p className="text-sm font-semibold text-zinc-900 mt-0.5">{client.profession}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Especialidades & Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {client.specialties && client.specialties.length > 0 ? (
                    client.specialties.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium border border-zinc-200"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-400 italic">No especificadas</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Descripción Corta / Slogan
                </label>
                <p className="text-xs text-zinc-700 mt-1">{client.shortDescription || 'Sin descripción'}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Biografía Completa
                </label>
                <p className="text-xs text-zinc-700 mt-1 leading-relaxed bg-zinc-50 p-3.5 rounded-lg border border-zinc-100">
                  {client.bio || 'Sin biografía cargada'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Ubicación & Horarios
                </label>
                <p className="text-xs text-zinc-800 mt-1 font-medium">
                  {client.locationDetails || `${client.city}, ${client.country}`}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Horarios de atención: {client.workingHours || 'No especificados'}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Formación Académica
                </label>
                <p className="text-xs text-zinc-700 mt-1">
                  {client.educationSummary || 'Facultad / Universidad registradas en pestaña Contenido'}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Trayectoria / Experiencia
                </label>
                <p className="text-xs text-zinc-700 mt-1">
                  {client.experienceSummary || 'Estudios previos y cargos registrados'}
                </p>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                  Editar Información Profesional
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INFORMACIÓN COMERCIAL */}
      {activeTab === 'commercial' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="text-base font-bold text-zinc-900 font-display">
              Información Comercial & Cobranzas
            </h3>
            <p className="text-xs text-zinc-500">
              Condiciones de venta, esquema de honorarios, formas de pago y fechas de renovación anual.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Producto Contratado
              </span>
              <p className="text-sm font-bold text-zinc-900 mt-1">{client.contractedProduct || 'Web Trayectoria'}</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Precio Acordado
              </span>
              <p className="text-base font-bold font-mono text-zinc-900 mt-1">{client.price || '$0'}</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Estado del Pago
              </span>
              <div className="mt-1">
                <StatusPill status={client.paymentStatus} size="sm" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Fecha Renovación
              </span>
              <p className="text-sm font-bold font-mono text-zinc-900 mt-1">
                {client.renewalDate || 'No fijada'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Forma de Pago
              </span>
              <p className="text-xs font-medium text-zinc-800 mt-1">
                {client.paymentMethod || 'Transferencia Bancaria'}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Notas Comerciales
              </span>
              <p className="text-xs text-zinc-700 mt-1 p-3.5 rounded-lg bg-zinc-50 border border-zinc-100">
                {client.commercialNotes || 'Sin notas comerciales adicionales.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FICHA TÉCNICA (Non-sensitive metadata only!) */}
      {activeTab === 'technical' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-zinc-900 font-display">
                Ficha Técnica del Sitio & Despliegues
              </h3>
              <p className="text-xs text-zinc-500">
                Metadatos técnicos, repositorios, proyectos de Cloudflare y registros de hosting.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-600">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              Sin credenciales en texto plano
            </div>
          </div>

          {/* DEDICATED NIC.AR & CLOUDFLARE DNS DELEGATION CARD */}
          <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-zinc-900 text-white">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Delegación en NIC.AR / Servidores DNS (Nameservers)
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Hostnames que se configuran en el panel de NIC Argentina (TAD) para apuntar el dominio a Cloudflare.
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  client.nicDelegationStatus === 'Delegado y Verificado'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                {client.nicDelegationStatus || 'Pendiente de Delegación en NIC'}
              </span>
            </div>

            {/* Nameservers copyable blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {client.dnsNameservers && client.dnsNameservers.length > 0 ? (
                client.dnsNameservers.map((ns, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs group"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                        Servidor DNS {idx + 1} (Host NIC.AR):
                      </span>
                      <span className="font-mono text-xs font-bold text-zinc-900 select-all block truncate">
                        {ns}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(ns);
                        alert(`Copiado: ${ns}`);
                      }}
                      className="text-[11px] px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-700 font-medium transition-colors shrink-0 ml-2"
                      title="Copiar para pegar en NIC.AR"
                    >
                      Copiar
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-white rounded-lg border border-zinc-200 text-xs text-zinc-400 italic col-span-2">
                  No se han registrado los nameservers para este dominio.
                </div>
              )}
            </div>

            {/* Additional NIC info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-zinc-200/60">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  Titular del Dominio:
                </span>
                <span className="font-semibold text-zinc-800">
                  {client.fullName} ({client.domainRegistrar || 'NIC Argentina'})
                </span>
              </div>
              {client.nicAuthCode && (
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Código de Trámite / Auth-Code:
                  </span>
                  <span className="font-mono font-bold text-zinc-800 bg-white px-2 py-0.5 rounded border border-zinc-200">
                    {client.nicAuthCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hosting & URLs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-1.5">
                Hosting & URLs
              </h4>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    URL de Producción
                  </span>
                  {client.productionUrl ? (
                    <a
                      href={client.productionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-semibold text-zinc-900 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      {client.productionUrl} <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">No publicada todavía</span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    URL Temporal / Preview
                  </span>
                  {client.tempPreviewUrl ? (
                    <a
                      href={client.tempPreviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      {client.tempPreviewUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">Sin preview generada</span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Proyecto Cloudflare
                  </span>
                  <p className="text-xs font-mono font-semibold text-zinc-800 mt-1">
                    {client.cloudflareProject || 'trayectoria-cliente'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Estado del Deployment
                  </span>
                  <p className="text-xs text-zinc-700 mt-1">
                    {client.deploymentStatus || 'Producción activa (Cloudflare Pages)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Code & Domain */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-1.5">
                Código & Dominio
              </h4>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Repositorio GitHub
                  </span>
                  <p className="text-xs font-mono font-bold text-zinc-900 mt-1">
                    {client.githubRepoName || 'trayectoria/repo-cliente'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Framework Utilizado
                  </span>
                  <p className="text-xs font-medium text-zinc-800 mt-1">
                    {client.framework || 'Astro + Tailwind CSS'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Dominio Principal & Vencimiento
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-zinc-900">
                      {client.primaryDomain || 'Sin dominio'}
                    </span>
                    {client.domainExpiration && (
                      <DomainAlertBadge expirationDate={client.domainExpiration} />
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    Registrador: {client.domainRegistrar || 'NIC Argentina'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTENIDO DEL CLIENTE */}
      {activeTab === 'content' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-700" />
                Contenido Editorial del Cliente
              </h3>
              <p className="text-xs text-zinc-500">
                Auditoría de activos recibidos para la construcción de su sitio web.
              </p>
            </div>

            {/* Visual Indicator Pill */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                contentCompleteness.isComplete
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {contentCompleteness.isComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ Contenido Completo (100%)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>⚠ Falta Información ({contentCompleteness.percentage}% cargado)</span>
                </>
              )}
            </div>
          </div>

          {/* Sections Checklist & Preview */}
          <div className="space-y-4">
            {/* Section 1: Identidad */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleToggleContentSection('identity')}
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      client.content.identity.isComplete
                        ? 'bg-zinc-900 border-zinc-900 text-white'
                        : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {client.content.identity.isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    1. Identidad Visual (Logo, Colores, Tipografías)
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    client.content.identity.isComplete
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {client.content.identity.isComplete ? 'Completo' : 'Pendiente'}
                </span>
              </div>

              <div className="text-xs text-zinc-600 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Nombre / Marca:</span>
                  <span className="font-semibold text-zinc-900">{client.content.identity.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Paleta de Colores:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {client.content.identity.colors?.map((c, i) => (
                      <span
                        key={i}
                        className="inline-block w-4 h-4 rounded-full border border-zinc-300 shadow-2xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                    <span className="text-[10px] text-zinc-500 font-mono ml-1">
                      {client.content.identity.colors?.join(', ')}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Tipografías:</span>
                  <span className="font-medium text-zinc-800">{client.content.identity.fonts || 'Inter'}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Presentación */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleToggleContentSection('presentation')}
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      client.content.presentation.isComplete
                        ? 'bg-zinc-900 border-zinc-900 text-white'
                        : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {client.content.presentation.isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    2. Presentación & Textos (Bio, Slogan, Titulares)
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    client.content.presentation.isComplete
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {client.content.presentation.isComplete ? 'Completo' : 'Pendiente'}
                </span>
              </div>

              <div className="text-xs text-zinc-700 space-y-1">
                {client.content.presentation.mainSlogan && (
                  <p className="font-serif italic text-zinc-900">
                    &ldquo;{client.content.presentation.mainSlogan}&rdquo;
                  </p>
                )}
                <p className="text-zinc-600">{client.content.presentation.bio}</p>
              </div>
            </div>

            {/* Section 3: Servicios */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleToggleContentSection('services')}
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      client.content.services.isComplete
                        ? 'bg-zinc-900 border-zinc-900 text-white'
                        : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {client.content.services.isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    3. Listado de Servicios ({client.content.services.items.length})
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    client.content.services.isComplete
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {client.content.services.isComplete ? 'Completo' : 'Pendiente'}
                </span>
              </div>

              {client.content.services.items.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No hay servicios cargados aún.</p>
              ) : (
                <div className="space-y-2">
                  {client.content.services.items.map((srv) => (
                    <div key={srv.id} className="p-2.5 rounded-lg bg-white border border-zinc-200/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-900">{srv.name}</span>
                        {srv.price && (
                          <span className="font-mono text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                            {srv.price}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-[11px] mt-0.5">{srv.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Portfolio / Proyectos */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleToggleContentSection('portfolio')}
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      client.content.portfolio.isComplete
                        ? 'bg-zinc-900 border-zinc-900 text-white'
                        : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {client.content.portfolio.isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    4. Portfolio & Fotografías de Casos ({client.content.portfolio.items.length})
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    client.content.portfolio.isComplete
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {client.content.portfolio.isComplete ? 'Completo' : 'Pendiente'}
                </span>
              </div>

              {client.content.portfolio.items.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No hay casos de portfolio cargados aún.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {client.content.portfolio.items.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-white border border-zinc-200/80 text-xs flex gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 rounded-md object-cover border border-zinc-200 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="font-semibold text-zinc-900 block truncate">{item.title}</span>
                        <p className="text-zinc-500 text-[11px] line-clamp-2 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CHECKLIST DEL PROYECTO */}
      {activeTab === 'checklist' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="text-base font-bold text-zinc-900 font-display">
              Checklist de Entrega & Publicación
            </h3>
            <p className="text-xs text-zinc-500">
              Pasos indispensables para el control de calidad, diseño editorial, maquetación y despliegue técnico.
            </p>
          </div>

          {!primaryProject ? (
            <p className="text-xs text-zinc-400 italic">No hay proyecto activo asociado.</p>
          ) : (
            <div className="space-y-6">
              {(['CLIENTE', 'DISEÑO', 'DESARROLLO', 'PUBLICACIÓN'] as const).map((category) => {
                const categoryItems = primaryProject.checklist.filter((c) => c.category === category);
                const completedCount = categoryItems.filter((c) => c.completed).length;

                return (
                  <div key={category} className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-display">
                        {category} ({completedCount}/{categoryItems.length})
                      </h4>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {Math.round((completedCount / (categoryItems.length || 1)) * 100)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleChecklistItem(item.id)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center gap-3 transition-colors ${
                            item.completed
                              ? 'bg-zinc-50/70 border-zinc-200 text-zinc-800'
                              : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              item.completed
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'border-zinc-300 bg-white'
                            }`}
                          >
                            {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </span>
                          <span className={item.completed ? 'line-through text-zinc-400 font-medium' : 'font-medium'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: HISTORIAL / ACTIVIDAD */}
      {activeTab === 'activity' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 font-display">
                Historial Cronológico de Contactos & Cambios
              </h3>
              <p className="text-xs text-zinc-500">Registro auditado de todo lo ocurrido con el cliente.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsActivityModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              + Agregar Actividad
            </Button>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No hay actividad registrada para este cliente.</p>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} className="relative text-xs space-y-1">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-zinc-900 border-2 border-white ring-2 ring-zinc-200" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">{log.title}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{log.date}</span>
                  </div>
                  <p className="text-zinc-600">{log.description}</p>
                  <span className="text-[10px] text-zinc-400">Registrado por: {log.author}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 8: NOTAS INTERNAS */}
      {activeTab === 'notes' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-700" />
              Notas Internas Privadas
            </h3>
            <p className="text-xs text-zinc-500">
              Estas notas son exclusivas del equipo de TRAYECTORIA y no forman parte de la web del cliente.
            </p>
          </div>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Ej: Prefiere comunicación por WhatsApp en horario de mañana. Pidió no usar fotografías de stock..."
              rows={3}
              className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
            <div className="flex justify-end">
              <Button variant="primary" size="sm" type="submit">
                Guardar Nota Privada
              </Button>
            </div>
          </form>

          <div className="divide-y divide-zinc-100 pt-2">
            {notes.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No hay notas internas registradas aún.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-zinc-800 font-medium">{note.content}</p>
                    <span className="text-[10px] text-zinc-400 font-mono block">
                      {note.createdAt} • Autor: {note.author}
                    </span>
                  </div>
                  <button
                    onClick={() => db.deleteNote(note.id)}
                    className="p-1 text-zinc-300 hover:text-rose-600 rounded transition-colors shrink-0"
                    title="Eliminar nota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      <ClientFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        clientToEdit={client}
      />

      {/* Add Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        defaultClientId={client.id}
      />
    </div>
  );
};
