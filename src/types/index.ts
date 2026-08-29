export type ClientStatus =
  | 'Prospecto'
  | 'Contactado'
  | 'Cliente'
  | 'En producción'
  | 'Activo'
  | 'Pausado'
  | 'Finalizado';

export type ProjectStatus =
  | 'Pendiente'
  | 'Esperando contenido'
  | 'En diseño'
  | 'En desarrollo'
  | 'En revisión'
  | 'Correcciones'
  | 'Publicado'
  | 'Finalizado'
  | 'Pausado';

export type WebStatus =
  | 'Desarrollo'
  | 'Preview'
  | 'En revisión'
  | 'Publicada'
  | 'Mantenimiento'
  | 'Offline';

export type DomainRegistrar = 'NIC Argentina' | 'Cloudflare Registrar' | 'Otro';

export type DomainType = '.com.ar' | '.ar' | '.com' | '.net' | '.io' | '.org' | '.dev' | 'Otro';

export type DomainStatus = 'Activo' | 'En trámite' | 'Delegado' | 'Vencido' | 'Pausado';

export type TaskPriority = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export type PaymentStatus = 'Al día' | 'Pendiente' | 'Parcial' | 'Bonificado' | 'Renovación pendiente';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price?: string;
}

export interface EducationItem {
  id: string;
  career: string;
  institution: string;
  year: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  description: string;
  year: string;
}

export type OnboardingStatus = 'No iniciado' | 'En progreso' | 'Información recibida' | 'En revisión';

export interface OnboardingData {
  step: number; // 0 to 6
  status: OnboardingStatus;
  progressPercentage: number;
  lastSavedAt: string;
  completedAt?: string;

  personal: {
    firstName: string;
    lastName: string;
    brandName: string;
    preferredName: string;
    profession: string;
    specialty: string;
    city: string;
    email: string;
    whatsapp: string;
    photoStatus: 'uploaded' | 'send_later' | 'none';
    photoUrl?: string;
  };

  story: {
    presentation: string;
    experiences: { id: string; place: string; role: string; year: string; description: string }[];
    education: { id: string; institution: string; career: string; year: string }[];
  };

  offer: {
    services: { id: string; name: string; description: string }[];
    specialties: string[];
    showProjects: boolean;
    projects: { id: string; name: string; description: string; year: string; url?: string; images?: string[] }[];
  };

  contact: {
    email: string;
    whatsapp: string;
    instagram: string;
    linkedin: string;
    website: string;
    behance: string;
    other: string;
    primaryContactMethod: 'WhatsApp' | 'Email' | 'Instagram' | 'Formulario de contacto';
    showLocation: boolean;
    city: string;
    province: string;
    country: string;
    address?: string;
    googleMapsUrl?: string;
  };

  style: {
    hasLogo: boolean;
    logoUrl?: string;
    colors: string[];
    customColorNotes?: string;
    referenceUrls: string[];
    referenceNotes?: string;
    moodTags: string[];
    negativePreferences?: string;
    additionalPhotosNotes?: string;
  };
}

export interface ClientContent {
  identity: {
    name: string;
    profession: string;
    photoUrl?: string;
    logoUrl?: string;
    colors: string[]; // Hex codes or descriptions
    fonts: string;
    isComplete: boolean;
  };
  presentation: {
    bio: string;
    shortDescription: string;
    mainSlogan: string;
    isComplete: boolean;
  };
  services: {
    items: ServiceItem[];
    isComplete: boolean;
  };
  education: {
    items: EducationItem[];
    isComplete: boolean;
  };
  experience: {
    items: ExperienceItem[];
    isComplete: boolean;
  };
  contact: {
    whatsapp: string;
    email: string;
    instagram?: string;
    linkedin?: string;
    location: string;
    googleMapsUrl?: string;
    schedule?: string;
    isComplete: boolean;
  };
  portfolio: {
    items: PortfolioItem[];
    isComplete: boolean;
  };
}

export interface ChecklistItem {
  id: string;
  category: 'CLIENTE' | 'DISEÑO' | 'DESARROLLO' | 'PUBLICACIÓN';
  label: string;
  completed: boolean;
  completedAt?: string;
}

export interface InternalNote {
  id: string;
  clientId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  type: 'client_created' | 'status_change' | 'content_received' | 'preview_sent' | 'change_requested' | 'web_published' | 'domain_registered' | 'task_completed' | 'custom_note';
  title: string;
  description: string;
  date: string; // ISO or YYYY-MM-DD
  author: string;
}

export interface Task {
  id: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  assignedTo: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}

export interface Client {
  id: string; // TRAY-00001
  fullName: string;
  commercialName: string;
  profession: string;
  email: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  city: string;
  country: string;
  photoUrl?: string;
  createdAt: string; // YYYY-MM-DD
  status: ClientStatus;
  lastContact: string; // YYYY-MM-DD
  
  // Onboarding status and data
  onboardingStatus?: OnboardingStatus;
  onboarding?: OnboardingData;
  
  // Professional info
  specialties: string[];
  bio: string;
  shortDescription: string;
  experienceSummary: string;
  educationSummary: string;
  locationDetails: string;
  workingHours: string;

  // Commercial info
  contractedProduct: string;
  price: string;
  paymentMethod: string;
  contractDate: string;
  paymentStatus: PaymentStatus;
  renewalDate?: string;
  commercialNotes?: string;

  // Technical metadata (Non-sensitive only)
  primaryDomain?: string;
  domainRegistrar?: DomainRegistrar;
  domainExpiration?: string;
  dnsNameservers?: string[]; // Nameservers a configurar en NIC.AR (ej. anna.ns.cloudflare.com, george.ns.cloudflare.com)
  nicDelegationStatus?: 'Delegado y Verificado' | 'Pendiente de Delegación en NIC' | 'En propagación DNS';
  nicAuthCode?: string; // Código de transferencia / Identificador de trámite si aplica
  cloudflareProject?: string;
  cloudflareZoneId?: string; // ID de Zona no confidencial
  productionUrl?: string;
  tempPreviewUrl?: string;
  githubRepoName?: string;
  githubRepoUrl?: string;
  framework?: string;
  deploymentStatus?: string;

  // Content store
  content: ClientContent;
}

export interface Project {
  id: string; // TRAY-00001-P01
  clientId: string;
  clientName: string;
  name: string;
  projectType: string;
  status: ProjectStatus;
  startDate: string;
  estimatedDeliveryDate: string;
  realDeliveryDate?: string;
  price: string;
  responsible: string;
  notes: string;
  checklist: ChecklistItem[];
  createdAt: string;
}

export interface WebSite {
  id: string; // TRAY-00001-W01
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  siteName: string;
  primaryDomain: string;
  secondaryDomains: string[];
  productionUrl: string;
  previewUrl: string;
  githubRepoName: string;
  githubRepoUrl: string;
  cloudflareProject: string;
  status: WebStatus;
  publishedAt?: string;
  lastUpdatedAt: string;
  framework: string;
  technicalNotes: string;
}

export interface Domain {
  id: string; // TRAY-00001-D01
  domainName: string;
  clientId: string;
  clientName: string;
  domainType: DomainType;
  registrar: DomainRegistrar;
  owner: string; // Titular (Cliente)
  managedBy: string; // TRAYECTORIA (Administración técnica)
  dnsNameservers?: string[]; // Hosts de delegación en NIC.AR (ej. anna.ns.cloudflare.com)
  nicDelegationStatus?: 'Delegado y Verificado' | 'Pendiente de Delegación en NIC' | 'En propagación DNS';
  registeredDate: string;
  expirationDate: string;
  status: DomainStatus;
  notes: string;
  autoRenew: boolean;
}

export interface AppStatistics {
  totalClients: number;
  activeClients: number;
  projectsInProduction: number;
  pendingProjects: number;
  activeWebs: number;
  expiringDomainsCount: number;
  pendingTasksCount: number;
  clientsWaitingContent: number;
}
