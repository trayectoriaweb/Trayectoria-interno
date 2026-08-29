import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { db } from '../../services/db/repository';
import { ActivityLog } from '../../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClientId?: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  defaultClientId,
}) => {
  const clients = db.getClients();
  const [clientId, setClientId] = useState(defaultClientId || (clients[0]?.id ?? ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ActivityLog['type']>('custom_note');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedClient = clients.find((c) => c.id === clientId);

    db.addActivityLog({
      clientId: clientId || undefined,
      clientName: selectedClient ? selectedClient.fullName : undefined,
      type,
      title: title.trim(),
      description: description.trim(),
      date,
      author: 'Operaciones Trayectoria',
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  const typeOptions = [
    { value: 'custom_note', label: 'Nota / Registro de contacto' },
    { value: 'content_received', label: 'Contenido recibido' },
    { value: 'preview_sent', label: 'Preview enviada' },
    { value: 'change_requested', label: 'Cambio solicitado por cliente' },
    { value: 'status_change', label: 'Cambio de estado' },
    { value: 'web_published', label: 'Web publicada' },
    { value: 'domain_registered', label: 'Dominio registrado' },
    { value: 'task_completed', label: 'Tarea completada' },
  ];

  const clientOptions = [
    { value: '', label: 'General / Sin cliente asignado' },
    ...clients.map((c) => ({ value: c.id, label: `${c.fullName} (${c.id})` })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Actividad Manual"
      subtitle="Agregá un hito cronológico, contacto o cambio relevante en el historial operativo."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Cliente Asociado"
          options={clientOptions}
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />

        <Select
          label="Tipo de Evento"
          options={typeOptions}
          value={type}
          onChange={(e) => setType(e.target.value as ActivityLog['type'])}
        />

        <Input
          label="Título del Evento / Hito"
          placeholder="Ej. Recibimos fotografías en alta resolución"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Detalle / Descripción"
          placeholder="Escribí los detalles de la conversación, archivos recibidos o modificaciones pactadas..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar en Historial
          </Button>
        </div>
      </form>
    </Modal>
  );
};
