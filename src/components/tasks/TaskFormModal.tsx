import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { db } from '../../services/db/repository';
import { Task, TaskPriority } from '../../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClientId?: string;
  onSaved?: (task: Task) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  defaultClientId,
  onSaved,
}) => {
  const clients = db.getClients();
  const projects = db.getProjects();

  const [clientId, setClientId] = useState(defaultClientId || '');
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Media');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [assignedTo, setAssignedTo] = useState('Operaciones Trayectoria');

  const clientProjects = projects.filter((p) => p.clientId === clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedClient = clients.find((c) => c.id === clientId);
    const selectedProject = projects.find((p) => p.id === projectId);

    const created = db.createTask({
      clientId: clientId || undefined,
      clientName: selectedClient?.fullName,
      projectId: projectId || undefined,
      projectName: selectedProject?.name,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      assignedTo: assignedTo.trim(),
    });

    if (created && onSaved) onSaved(created);
    onClose();
  };

  const priorityOptions = [
    { value: 'Baja', label: 'Baja' },
    { value: 'Media', label: 'Media' },
    { value: 'Alta', label: 'Alta' },
    { value: 'Urgente', label: 'Urgente' },
  ];

  const clientOptions = [
    { value: '', label: 'General / Sin cliente específico' },
    ...clients.map((c) => ({ value: c.id, label: `${c.fullName} (${c.id})` })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nueva Tarea Operativa"
      subtitle="Gestioná recordatorios de renovaciones, entregas de contenido o revisiones de código."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título de la Tarea *"
          placeholder="Ej. Enviar recordatorio de renovación de NIC Argentina"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Cliente Asociado"
            options={clientOptions}
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setProjectId('');
            }}
          />
          <Select
            label="Prioridad"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Fecha Límite / Vencimiento *"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <Input
            label="Asignado a"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>

        <Textarea
          label="Detalles o Instrucciones"
          placeholder="Instrucciones adicionales para la ejecución de la tarea..."
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Crear Tarea
          </Button>
        </div>
      </form>
    </Modal>
  );
};
