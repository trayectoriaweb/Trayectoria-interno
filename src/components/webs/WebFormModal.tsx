import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { db } from '../../services/db/repository';
import { WebSite, WebStatus } from '../../types';

interface WebFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  webToEdit?: WebSite | null;
  defaultClientId?: string;
  onSaved?: (web: WebSite) => void;
}

export const WebFormModal: React.FC<WebFormModalProps> = ({
  isOpen,
  onClose,
  webToEdit,
  defaultClientId,
  onSaved,
}) => {
  const clients = db.getClients();
  const projects = db.getProjects();

  const [clientId, setClientId] = useState(defaultClientId || (clients[0]?.id ?? ''));
  const [projectId, setProjectId] = useState('');
  const [siteName, setSiteName] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [secondaryDomainsStr, setSecondaryDomainsStr] = useState('');
  const [productionUrl, setProductionUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [githubRepoName, setGithubRepoName] = useState('');
  const [cloudflareProject, setCloudflareProject] = useState('');
  const [status, setStatus] = useState<WebStatus>('Desarrollo');
  const [framework, setFramework] = useState('Astro + Tailwind CSS');
  const [technicalNotes, setTechnicalNotes] = useState('');

  const clientProjects = projects.filter((p) => p.clientId === clientId);

  useEffect(() => {
    if (clientProjects.length > 0 && !projectId) {
      setProjectId(clientProjects[0].id);
    }
  }, [clientId, clientProjects]);

  useEffect(() => {
    if (webToEdit) {
      setClientId(webToEdit.clientId);
      setProjectId(webToEdit.projectId);
      setSiteName(webToEdit.siteName);
      setPrimaryDomain(webToEdit.primaryDomain);
      setSecondaryDomainsStr(webToEdit.secondaryDomains?.join(', ') || '');
      setProductionUrl(webToEdit.productionUrl || '');
      setPreviewUrl(webToEdit.previewUrl || '');
      setGithubRepoName(webToEdit.githubRepoName || '');
      setCloudflareProject(webToEdit.cloudflareProject || '');
      setStatus(webToEdit.status);
      setFramework(webToEdit.framework || 'Astro + Tailwind CSS');
      setTechnicalNotes(webToEdit.technicalNotes || '');
    } else {
      setClientId(defaultClientId || (clients[0]?.id ?? ''));
      setSiteName('');
      setPrimaryDomain('');
      setSecondaryDomainsStr('');
      setProductionUrl('');
      setPreviewUrl('');
      setGithubRepoName('');
      setCloudflareProject('');
      setStatus('Desarrollo');
      setFramework('Astro + Tailwind CSS');
      setTechnicalNotes('');
    }
  }, [webToEdit, isOpen, defaultClientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim() || !primaryDomain.trim()) return;

    const selectedClient = clients.find((c) => c.id === clientId);
    const selectedProject = projects.find((p) => p.id === projectId);

    const clientName = selectedClient ? selectedClient.fullName : 'Cliente';
    const projectName = selectedProject ? selectedProject.name : 'Proyecto';
    const secondaryDomains = secondaryDomainsStr
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    if (webToEdit) {
      const updated = db.updateWeb(webToEdit.id, {
        clientId,
        clientName,
        projectId,
        projectName,
        siteName: siteName.trim(),
        primaryDomain: primaryDomain.trim(),
        secondaryDomains,
        productionUrl: productionUrl.trim(),
        previewUrl: previewUrl.trim(),
        githubRepoName: githubRepoName.trim(),
        cloudflareProject: cloudflareProject.trim(),
        status,
        framework: framework.trim(),
        technicalNotes: technicalNotes.trim(),
      });
      if (updated && onSaved) onSaved(updated);
    } else {
      const created = db.createWeb({
        clientId,
        clientName,
        projectId: projectId || (clientProjects[0]?.id ?? 'TRAY-00001-P01'),
        projectName,
        siteName: siteName.trim(),
        primaryDomain: primaryDomain.trim(),
        secondaryDomains,
        productionUrl: productionUrl.trim(),
        previewUrl: previewUrl.trim(),
        githubRepoName: githubRepoName.trim(),
        githubRepoUrl: `https://github.com/${githubRepoName.trim()}`,
        cloudflareProject: cloudflareProject.trim(),
        status,
        framework: framework.trim(),
        technicalNotes: technicalNotes.trim(),
      });
      if (created && onSaved) onSaved(created);
    }

    onClose();
  };

  const statusOptions = [
    { value: 'Desarrollo', label: 'Desarrollo' },
    { value: 'Preview', label: 'Preview / Staging' },
    { value: 'En revisión', label: 'En revisión' },
    { value: 'Publicada', label: 'Publicada' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
    { value: 'Offline', label: 'Offline' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={webToEdit ? `Editar Web — ${webToEdit.id}` : 'Alta de Nueva Web'}
      subtitle="Registrá los metadatos de hosting, Cloudflare Pages, repositorios y URLs."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Cliente *"
            options={clients.map((c) => ({ value: c.id, label: `${c.fullName} (${c.id})` }))}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            disabled={!!webToEdit}
          />
          <Select
            label="Proyecto Asociado *"
            options={
              clientProjects.length > 0
                ? clientProjects.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }))
                : [{ value: '', label: 'Sin proyectos disponibles' }]
            }
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nombre del Sitio *"
            placeholder="Ej. Juan Pérez Arq"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
          />
          <Input
            label="Dominio Principal *"
            placeholder="juanperez.com.ar"
            value={primaryDomain}
            onChange={(e) => setPrimaryDomain(e.target.value)}
            required
          />
          <Input
            label="Dominios Secundarios (Separados por coma)"
            placeholder="www.juanperez.com.ar, juanperez.ar"
            value={secondaryDomainsStr}
            onChange={(e) => setSecondaryDomainsStr(e.target.value)}
          />
          <Select
            label="Estado"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as WebStatus)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="URL de Producción"
            placeholder="https://juanperez.com.ar"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.target.value)}
          />
          <Input
            label="URL de Preview (Cloudflare Pages)"
            placeholder="https://juanperez-preview.pages.dev"
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
          />
          <Input
            label="Nombre del Repositorio GitHub"
            placeholder="trayectoria/juanperez-arqui"
            value={githubRepoName}
            onChange={(e) => setGithubRepoName(e.target.value)}
          />
          <Input
            label="Proyecto Cloudflare"
            placeholder="trayectoria-juan-perez"
            value={cloudflareProject}
            onChange={(e) => setCloudflareProject(e.target.value)}
          />
        </div>

        <Input
          label="Framework / Stack Tecnológico"
          placeholder="Astro + Tailwind CSS"
          value={framework}
          onChange={(e) => setFramework(e.target.value)}
        />

        <Textarea
          label="Notas Técnicas"
          placeholder="Configuración de cabeceras, SSL Full (Strict), DNS proxied..."
          rows={2}
          value={technicalNotes}
          onChange={(e) => setTechnicalNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {webToEdit ? 'Guardar Cambios' : 'Registrar Web'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
