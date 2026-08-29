import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { db } from '../../services/db/repository';
import { Client, ClientStatus, DomainRegistrar, PaymentStatus } from '../../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
  onSaved?: (client: Client) => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  clientToEdit,
  onSaved,
}) => {
  const [fullName, setFullName] = useState('');
  const [commercialName, setCommercialName] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [city, setCity] = useState('Córdoba');
  const [country, setCountry] = useState('Argentina');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Prospecto');
  
  // Professional
  const [bio, setBio] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  // Commercial
  const [contractedProduct, setContractedProduct] = useState('Web Identidad Editorial');
  const [price, setPrice] = useState('$450 USD');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Al día');
  const [commercialNotes, setCommercialNotes] = useState('');

  // Technical
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [domainRegistrar, setDomainRegistrar] = useState<DomainRegistrar>('NIC Argentina');
  const [domainExpiration, setDomainExpiration] = useState('');
  const [dnsNameserversStr, setDnsNameserversStr] = useState('anna.ns.cloudflare.com, george.ns.cloudflare.com');
  const [nicDelegationStatus, setNicDelegationStatus] = useState<
    'Delegado y Verificado' | 'Pendiente de Delegación en NIC' | 'En propagación DNS'
  >('Delegado y Verificado');
  const [nicAuthCode, setNicAuthCode] = useState('');
  const [cloudflareProject, setCloudflareProject] = useState('');
  const [cloudflareZoneId, setCloudflareZoneId] = useState('');
  const [githubRepoName, setGithubRepoName] = useState('');
  const [framework, setFramework] = useState('Astro + Tailwind CSS');

  useEffect(() => {
    if (clientToEdit) {
      setFullName(clientToEdit.fullName || '');
      setCommercialName(clientToEdit.commercialName || '');
      setProfession(clientToEdit.profession || '');
      setEmail(clientToEdit.email || '');
      setWhatsapp(clientToEdit.whatsapp || '');
      setInstagram(clientToEdit.instagram || '');
      setLinkedin(clientToEdit.linkedin || '');
      setCity(clientToEdit.city || 'Córdoba');
      setCountry(clientToEdit.country || 'Argentina');
      setPhotoUrl(clientToEdit.photoUrl || '');
      setStatus(clientToEdit.status || 'Prospecto');
      setBio(clientToEdit.bio || '');
      setShortDescription(clientToEdit.shortDescription || '');
      setSpecialtiesStr(clientToEdit.specialties ? clientToEdit.specialties.join(', ') : '');
      setLocationDetails(clientToEdit.locationDetails || '');
      setWorkingHours(clientToEdit.workingHours || '');
      setContractedProduct(clientToEdit.contractedProduct || 'Web Identidad Editorial');
      setPrice(clientToEdit.price || '$450 USD');
      setPaymentMethod(clientToEdit.paymentMethod || 'Transferencia Bancaria');
      setPaymentStatus(clientToEdit.paymentStatus || 'Al día');
      setCommercialNotes(clientToEdit.commercialNotes || '');
      setPrimaryDomain(clientToEdit.primaryDomain || '');
      setDomainRegistrar(clientToEdit.domainRegistrar || 'NIC Argentina');
      setDomainExpiration(clientToEdit.domainExpiration || '');
      setDnsNameserversStr(clientToEdit.dnsNameservers ? clientToEdit.dnsNameservers.join(', ') : 'anna.ns.cloudflare.com, george.ns.cloudflare.com');
      setNicDelegationStatus(clientToEdit.nicDelegationStatus || 'Delegado y Verificado');
      setNicAuthCode(clientToEdit.nicAuthCode || '');
      setCloudflareProject(clientToEdit.cloudflareProject || '');
      setCloudflareZoneId(clientToEdit.cloudflareZoneId || '');
      setGithubRepoName(clientToEdit.githubRepoName || '');
      setFramework(clientToEdit.framework || 'Astro + Tailwind CSS');
    } else {
      setFullName('');
      setCommercialName('');
      setProfession('');
      setEmail('');
      setWhatsapp('');
      setInstagram('');
      setLinkedin('');
      setCity('Córdoba');
      setCountry('Argentina');
      setPhotoUrl('');
      setStatus('Prospecto');
      setBio('');
      setShortDescription('');
      setSpecialtiesStr('');
      setLocationDetails('');
      setWorkingHours('');
      setContractedProduct('Web Identidad Editorial');
      setPrice('$450 USD');
      setPaymentMethod('Transferencia Bancaria');
      setPaymentStatus('Pendiente');
      setCommercialNotes('');
      setPrimaryDomain('');
      setDomainRegistrar('NIC Argentina');
      setDomainExpiration('');
      setDnsNameserversStr('anna.ns.cloudflare.com, george.ns.cloudflare.com');
      setNicDelegationStatus('Pendiente de Delegación en NIC');
      setNicAuthCode('');
      setCloudflareProject('');
      setCloudflareZoneId('');
      setGithubRepoName('');
      setFramework('Astro + Tailwind CSS');
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !profession.trim()) return;

    const specialties = specialtiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const dnsNameservers = dnsNameserversStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (clientToEdit) {
      const updated = db.updateClient(clientToEdit.id, {
        fullName: fullName.trim(),
        commercialName: commercialName.trim(),
        profession: profession.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim(),
        linkedin: linkedin.trim(),
        city: city.trim(),
        country: country.trim(),
        photoUrl: photoUrl.trim(),
        status,
        bio: bio.trim(),
        shortDescription: shortDescription.trim(),
        specialties,
        locationDetails: locationDetails.trim(),
        workingHours: workingHours.trim(),
        contractedProduct: contractedProduct.trim(),
        price: price.trim(),
        paymentMethod: paymentMethod.trim(),
        paymentStatus,
        commercialNotes: commercialNotes.trim(),
        primaryDomain: primaryDomain.trim(),
        domainRegistrar,
        domainExpiration: domainExpiration || undefined,
        dnsNameservers,
        nicDelegationStatus,
        nicAuthCode: nicAuthCode.trim(),
        cloudflareProject: cloudflareProject.trim(),
        cloudflareZoneId: cloudflareZoneId.trim(),
        githubRepoName: githubRepoName.trim(),
        framework: framework.trim(),
      });
      if (updated && onSaved) onSaved(updated);
    } else {
      const created = db.createClient({
        fullName: fullName.trim(),
        commercialName: commercialName.trim(),
        profession: profession.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim(),
        linkedin: linkedin.trim(),
        city: city.trim(),
        country: country.trim(),
        photoUrl: photoUrl.trim(),
        status,
        bio: bio.trim(),
        shortDescription: shortDescription.trim(),
        specialties,
        experienceSummary: '',
        educationSummary: '',
        locationDetails: locationDetails.trim(),
        workingHours: workingHours.trim(),
        contractedProduct: contractedProduct.trim(),
        price: price.trim(),
        paymentMethod: paymentMethod.trim(),
        contractDate: new Date().toISOString().split('T')[0],
        paymentStatus,
        commercialNotes: commercialNotes.trim(),
        primaryDomain: primaryDomain.trim(),
        domainRegistrar,
        domainExpiration: domainExpiration || undefined,
        dnsNameservers,
        nicDelegationStatus,
        nicAuthCode: nicAuthCode.trim(),
        cloudflareProject: cloudflareProject.trim(),
        cloudflareZoneId: cloudflareZoneId.trim(),
        githubRepoName: githubRepoName.trim(),
        framework: framework.trim(),
        deploymentStatus: 'No inicializado',
        lastContact: new Date().toISOString().split('T')[0],
      });
      if (created && onSaved) onSaved(created);
    }

    onClose();
  };

  const statusOptions = [
    { value: 'Prospecto', label: 'Prospecto' },
    { value: 'Contactado', label: 'Contactado' },
    { value: 'Cliente', label: 'Cliente' },
    { value: 'En producción', label: 'En producción' },
    { value: 'Activo', label: 'Activo' },
    { value: 'Pausado', label: 'Pausado' },
    { value: 'Finalizado', label: 'Finalizado' },
  ];

  const registrarOptions = [
    { value: 'NIC Argentina', label: 'NIC Argentina (.com.ar / .ar)' },
    { value: 'Cloudflare Registrar', label: 'Cloudflare Registrar' },
    { value: 'Otro', label: 'Otro Registrador' },
  ];

  const paymentStatusOptions = [
    { value: 'Al día', label: 'Al día' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Parcial', label: 'Pago Parcial / Anticipo' },
    { value: 'Bonificado', label: 'Bonificado' },
    { value: 'Renovación pendiente', label: 'Renovación pendiente' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? `Editar Cliente — ${clientToEdit.id}` : 'Alta de Nuevo Cliente'}
      subtitle="Completá la ficha operativa del cliente. Se generará automáticamente un ID único y su proyecto inicial."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Identity */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-1.5">
            1. Datos Generales & Contacto
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nombre y Apellido *"
              placeholder="Ej. Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Nombre Comercial / Estudio"
              placeholder="Ej. Juan Pérez Arquitectura"
              value={commercialName}
              onChange={(e) => setCommercialName(e.target.value)}
            />
            <Input
              label="Profesión / Rubro *"
              placeholder="Ej. Arquitecto, Abogado, Diseñadora"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
            />
            <Select
              label="Estado Inicial"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as ClientStatus)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="WhatsApp"
              placeholder="+54 9 351 555-0192"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <Input
              label="Instagram"
              placeholder="@juanperez.arqui"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <Input
              label="LinkedIn"
              placeholder="linkedin.com/in/usuario"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <Input
              label="Ciudad"
              placeholder="Córdoba / Buenos Aires"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="País"
              placeholder="Argentina"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        {/* Commercial & Contract */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-1.5">
            2. Información Comercial
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Producto / Servicio Contratado"
              placeholder="Web Identidad & Portfolio Pro"
              value={contractedProduct}
              onChange={(e) => setContractedProduct(e.target.value)}
            />
            <Input
              label="Precio Acordado"
              placeholder="$450 USD / $350.000 ARS"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Forma de Pago"
              placeholder="Transferencia / Cripto / Stripe"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Select
              label="Estado del Pago"
              options={paymentStatusOptions}
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            />
          </div>
          <Textarea
            label="Notas Comerciales"
            placeholder="Condiciones acordadas, esquema de cuotas o renovación anual..."
            rows={2}
            value={commercialNotes}
            onChange={(e) => setCommercialNotes(e.target.value)}
          />
        </div>

        {/* Technical Metadata */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-1.5 flex items-center justify-between">
            <span>3. Datos Técnicos & Conexión NIC.AR / Cloudflare</span>
            <span className="text-[10px] text-zinc-400 font-normal">Sin contraseñas sensibles</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Dominio Principal"
              placeholder="juanperez.com.ar"
              value={primaryDomain}
              onChange={(e) => setPrimaryDomain(e.target.value)}
            />
            <Select
              label="Registrador"
              options={registrarOptions}
              value={domainRegistrar}
              onChange={(e) => setDomainRegistrar(e.target.value as DomainRegistrar)}
            />
            <Input
              label="Fecha Vencimiento Dominio"
              type="date"
              value={domainExpiration}
              onChange={(e) => setDomainExpiration(e.target.value)}
            />
            <Select
              label="Estado de Delegación en NIC.AR"
              options={[
                { value: 'Delegado y Verificado', label: '✓ Delegado y Verificado' },
                { value: 'Pendiente de Delegación en NIC', label: '⚠ Pendiente de Delegación en NIC' },
                { value: 'En propagación DNS', label: '⌛ En propagación DNS' },
              ]}
              value={nicDelegationStatus}
              onChange={(e) => setNicDelegationStatus(e.target.value as any)}
            />
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3">
            <Input
              label="Servidores DNS / Nameservers para NIC.AR (Separados por coma)"
              placeholder="anna.ns.cloudflare.com, george.ns.cloudflare.com"
              value={dnsNameserversStr}
              onChange={(e) => setDnsNameserversStr(e.target.value)}
              helperText="Estos son los 2 servidores de nombres que se cargan en TAD / NIC Argentina para delegar el dominio a Cloudflare."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Código de Trámite / Auth-Code TAD (Opcional)"
                placeholder="Ej. TAD-TR-123456"
                value={nicAuthCode}
                onChange={(e) => setNicAuthCode(e.target.value)}
                helperText="Identificador o código de expediente si se hizo gestión de titularidad."
              />
              <Input
                label="ID de Zona Cloudflare (Zone ID)"
                placeholder="cf-zone-xxxxxxxxxx"
                value={cloudflareZoneId}
                onChange={(e) => setCloudflareZoneId(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Proyecto Cloudflare"
              placeholder="trayectoria-juan-perez"
              value={cloudflareProject}
              onChange={(e) => setCloudflareProject(e.target.value)}
            />
            <Input
              label="Nombre Repo GitHub"
              placeholder="trayectoria/juanperez-arqui"
              value={githubRepoName}
              onChange={(e) => setGithubRepoName(e.target.value)}
            />
            <Input
              label="Framework / Stack"
              placeholder="Astro + Tailwind CSS"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {clientToEdit ? 'Actualizar Ficha' : 'Guardar y Generar ID'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
