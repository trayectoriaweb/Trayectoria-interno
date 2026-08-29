import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { db } from '../../services/db/repository';
import { Project, ProjectStatus } from '../../types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
  defaultClientId?: string;
  onSaved?: (project: Project) => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
  defaultClientId,
  onSaved,
}) => {
  const clients = db.getClients();

  const [clientId, setClientId] = useState(defaultClientId || (clients[0]?.id ?? ''));
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('Sitio Web Completo + Dominio');
  const [status, setStatus] = useState<ProjectStatus>('Pendiente');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [realDeliveryDate, setRealDeliveryDate] = useState('');
  const [price, setPrice] = useState('$450 USD');
  const [responsible, setResponsible] = useState('Operaciones Trayectoria');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setClientId(projectToEdit.clientId);
      setName(projectToEdit.name);
      setProjectType(projectToEdit.projectType);
      setStatus(projectToEdit.status);
      setStartDate(projectToEdit.startDate);
      setEstimatedDeliveryDate(projectToEdit.estimatedDeliveryDate || '');
      setRealDeliveryDate(projectToEdit.realDeliveryDate || '');
      setPrice(projectToEdit.price || '');
      setResponsible(projectToEdit.responsible || 'Operaciones Trayectoria');
      setNotes(projectToEdit.notes || '');
    } else {
      setClientId(defaultClientId || (clients[0]?.id ?? ''));
      setName('');
      setProjectType('Sitio Web Completo + Dominio');
      setStatus('Pendiente');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEstimatedDeliveryDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
      setRealDeliveryDate('');
      setPrice('$450 USD');
      setResponsible('Operaciones Trayectoria');
      setNotes('');
    }
  }, [projectToEdit, isOpen, defaultClientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientId) return;

    const selectedClient = clients.find((c) => c.id === clientId);
    const clientName = selectedClient ? selectedClient.fullName : 'Cliente';

    if (projectToEdit) {
      const updated = db.updateProject(projectToEdit.id, {
        clientId,
        clientName,
        name: name.trim(),
        projectType: projectType.trim(),
        status,
        startDate,
        estimatedDeliveryDate,
        realDeliveryDate: realDeliveryDate || undefined,
        price: price.trim(),
        responsible: responsible.trim(),
        notes: notes.trim(),
      });
      if (updated && onSaved) onSaved(updated);
    } else {
      const created = db.createProject({
        clientId,
        clientName,
        name: name.trim(),
        projectType: projectType.trim(),
        status,
        startDate,
        estimatedDeliveryDate,
        realDeliveryDate: realDeliveryDate || undefined,
        price: price.trim(),
        responsible: responsible.trim(),
        notes: notes.trim(),
      });
      if (created && onSaved) onSaved(created);
    }

    onClose();
  };

  const statusOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Esperando contenido', label: 'Esperando contenido' },
    { value: 'En diseño', label: 'En diseño' },
    { value: 'En desarrollo', label: 'En desarrollo' },
    { value: 'En revisión', label: 'En revisión' },
    { value: 'Correcciones', label: 'Correcciones' },
    { value: 'Publicado', label: 'Publicado' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Pausado', label: 'Pausado' },
  ];

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: `${c.fullName} — ${c.profession} (${c.id})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? `Editar Proyecto — ${projectToEdit.id}` : 'Alta de Nuevo Proyecto'}
      subtitle="Los proyectos gestionan el ciclo de vida de diseño, desarrollo, checklist y despliegue del cliente."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Cliente Titular *"
          options={clientOptions}
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          disabled={!!projectToEdit}
        />

        <Input
          label="Nombre del Proyecto *"
          placeholder="Ej. Web Identidad & Portfolio Arquitectura"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Tipo de Proyecto"
            placeholder="Sitio Web Completo / Portfolio"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          />
          <Select
            label="Estado"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          />
          <Input
            label="Fecha de Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Fecha Estimada Entrega"
            type="date"
            value={estimatedDeliveryDate}
            onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
          />
          <Input
            label="Precio / Presupuesto"
            placeholder="$450 USD"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label="Responsable Operativo"
            placeholder="Operaciones Trayectoria"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
          />
        </div>

        <Textarea
          label="Notas del Proyecto"
          placeholder="Requisitos especiales, notas de feedback o especificaciones de entrega..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
