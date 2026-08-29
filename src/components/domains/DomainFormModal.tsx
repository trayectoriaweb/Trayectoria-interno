import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { db } from '../../services/db/repository';
import { Domain, DomainRegistrar, DomainStatus, DomainType } from '../../types';

interface DomainFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainToEdit?: Domain | null;
  defaultClientId?: string;
  onSaved?: (domain: Domain) => void;
}

export const DomainFormModal: React.FC<DomainFormModalProps> = ({
  isOpen,
  onClose,
  domainToEdit,
  defaultClientId,
  onSaved,
}) => {
  const clients = db.getClients();

  const [clientId, setClientId] = useState(defaultClientId || (clients[0]?.id ?? ''));
  const [domainName, setDomainName] = useState('');
  const [domainType, setDomainType] = useState<DomainType>('.com.ar');
  const [registrar, setRegistrar] = useState<DomainRegistrar>('NIC Argentina');
  const [owner, setOwner] = useState('');
  const [managedBy, setManagedBy] = useState('TRAYECTORIA (Delegación técnica DNS)');
  const [registeredDate, setRegisteredDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationDate, setExpirationDate] = useState(
    new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<DomainStatus>('Activo');
  const [dnsNameserversStr, setDnsNameserversStr] = useState('anna.ns.cloudflare.com, george.ns.cloudflare.com');
  const [nicDelegationStatus, setNicDelegationStatus] = useState<
    'Delegado y Verificado' | 'Pendiente de Delegación en NIC' | 'En propagación DNS'
  >('Delegado y Verificado');
  const [notes, setNotes] = useState('');
  const [autoRenew, setAutoRenew] = useState(false);

  useEffect(() => {
    const selectedClient = clients.find((c) => c.id === clientId);
    if (!domainToEdit && selectedClient && !owner) {
      setOwner(`${selectedClient.fullName} (CUIT Cliente)`);
    }
  }, [clientId, clients, domainToEdit, owner]);

  useEffect(() => {
    if (domainToEdit) {
      setClientId(domainToEdit.clientId);
      setDomainName(domainToEdit.domainName);
      setDomainType(domainToEdit.domainType);
      setRegistrar(domainToEdit.registrar);
      setOwner(domainToEdit.owner);
      setManagedBy(domainToEdit.managedBy);
      setRegisteredDate(domainToEdit.registeredDate);
      setExpirationDate(domainToEdit.expirationDate);
      setStatus(domainToEdit.status);
      setDnsNameserversStr(domainToEdit.dnsNameservers ? domainToEdit.dnsNameservers.join(', ') : 'anna.ns.cloudflare.com, george.ns.cloudflare.com');
      setNicDelegationStatus(domainToEdit.nicDelegationStatus || 'Delegado y Verificado');
      setNotes(domainToEdit.notes || '');
      setAutoRenew(domainToEdit.autoRenew);
    } else {
      setClientId(defaultClientId || (clients[0]?.id ?? ''));
      setDomainName('');
      setDomainType('.com.ar');
      setRegistrar('NIC Argentina');
      setOwner('');
      setManagedBy('TRAYECTORIA (Delegación técnica DNS)');
      setRegisteredDate(new Date().toISOString().split('T')[0]);
      setExpirationDate(new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]);
      setStatus('Activo');
      setDnsNameserversStr('anna.ns.cloudflare.com, george.ns.cloudflare.com');
      setNicDelegationStatus('Pendiente de Delegación en NIC');
      setNotes('');
      setAutoRenew(false);
    }
  }, [domainToEdit, isOpen, defaultClientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim() || !clientId || !expirationDate) return;

    const selectedClient = clients.find((c) => c.id === clientId);
    const clientName = selectedClient ? selectedClient.fullName : 'Cliente';
    const dnsNameservers = dnsNameserversStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (domainToEdit) {
      const updated = db.updateDomain(domainToEdit.id, {
        clientId,
        clientName,
        domainName: domainName.trim().toLowerCase(),
        domainType,
        registrar,
        owner: owner.trim() || clientName,
        managedBy: managedBy.trim(),
        dnsNameservers,
        nicDelegationStatus,
        registeredDate,
        expirationDate,
        status,
        notes: notes.trim(),
        autoRenew,
      });
      if (updated && onSaved) onSaved(updated);
    } else {
      const created = db.createDomain({
        clientId,
        clientName,
        domainName: domainName.trim().toLowerCase(),
        domainType,
        registrar,
        owner: owner.trim() || clientName,
        managedBy: managedBy.trim(),
        dnsNameservers,
        nicDelegationStatus,
        registeredDate,
        expirationDate,
        status,
        notes: notes.trim(),
        autoRenew,
      });
      if (created && onSaved) onSaved(created);
    }

    onClose();
  };

  const domainTypeOptions = [
    { value: '.com.ar', label: '.com.ar (NIC Argentina)' },
    { value: '.ar', label: '.ar (NIC Argentina)' },
    { value: '.com', label: '.com (Internacional)' },
    { value: '.net', label: '.net' },
    { value: '.io', label: '.io' },
    { value: '.org', label: '.org' },
    { value: '.dev', label: '.dev' },
    { value: 'Otro', label: 'Otro TLD' },
  ];

  const registrarOptions = [
    { value: 'NIC Argentina', label: 'NIC Argentina' },
    { value: 'Cloudflare Registrar', label: 'Cloudflare Registrar' },
    { value: 'Otro', label: 'Otro Registrador' },
  ];

  const statusOptions = [
    { value: 'Activo', label: 'Activo / En línea' },
    { value: 'En trámite', label: 'En trámite de registro' },
    { value: 'Delegado', label: 'Delegado a Cloudflare' },
    { value: 'Vencido', label: 'Vencido' },
    { value: 'Pausado', label: 'Pausado' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={domainToEdit ? `Editar Dominio — ${domainToEdit.domainName}` : 'Registrar Dominio de Cliente'}
      subtitle="El dominio pertenece al cliente. TRAYECTORIA administra la conexión y delegación técnica."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Cliente Titular *"
          options={clients.map((c) => ({ value: c.id, label: `${c.fullName} (${c.id})` }))}
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          disabled={!!domainToEdit}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nombre del Dominio *"
            placeholder="ejemplo.com.ar"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            required
          />
          <Select
            label="Tipo de Dominio"
            options={domainTypeOptions}
            value={domainType}
            onChange={(e) => setDomainType(e.target.value as DomainType)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Registrador *"
            options={registrarOptions}
            value={registrar}
            onChange={(e) => setRegistrar(e.target.value as DomainRegistrar)}
          />
          <Select
            label="Estado del Dominio"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as DomainStatus)}
          />
        </div>

        <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3">
          <Input
            label="Servidores DNS / Nameservers NIC.AR (Separados por coma)"
            placeholder="anna.ns.cloudflare.com, george.ns.cloudflare.com"
            value={dnsNameserversStr}
            onChange={(e) => setDnsNameserversStr(e.target.value)}
            helperText="Hosts que se configuran en TAD / NIC Argentina para conectar con Cloudflare."
          />
          <Select
            label="Estado de Delegación en NIC"
            options={[
              { value: 'Delegado y Verificado', label: '✓ Delegado y Verificado' },
              { value: 'Pendiente de Delegación en NIC', label: '⚠ Pendiente de Delegación en NIC' },
              { value: 'En propagación DNS', label: '⌛ En propagación DNS' },
            ]}
            value={nicDelegationStatus}
            onChange={(e) => setNicDelegationStatus(e.target.value as any)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Titular Legal (Cliente)"
            placeholder="Juan Pérez (CUIT 20-33445566-9)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            helperText="La titularidad corresponde al cliente en NIC Argentina / TAD."
          />
          <Input
            label="Administración Técnica"
            placeholder="TRAYECTORIA (Delegación DNS)"
            value={managedBy}
            onChange={(e) => setManagedBy(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Fecha de Registro"
            type="date"
            value={registeredDate}
            onChange={(e) => setRegisteredDate(e.target.value)}
            required
          />
          <Input
            label="Fecha de Vencimiento *"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="autoRenewCheck"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
          />
          <label htmlFor="autoRenewCheck" className="text-xs text-zinc-700 font-medium">
            Renovación automática habilitada en el registrador
          </label>
        </div>

        <Textarea
          label="Notas Técnicas & DNS"
          placeholder="Nameservers asignados en Cloudflare, comprobantes de pago o CUIT del titular..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {domainToEdit ? 'Guardar Cambios' : 'Registrar Dominio'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
