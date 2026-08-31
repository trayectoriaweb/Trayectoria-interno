import { supabase, isSupabaseConfigured } from './client';
import { Client, Project, WebSite, Domain, Task, ActivityLog, InternalNote } from '../../types';

export const supabaseDb = {
  // CLIENTS
  async getClients(): Promise<Client[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching clients from Supabase:', error);
      return [];
    }
    return (data || []).map(mapRowToClient);
  },

  async createClient(client: Client): Promise<Client | null> {
    if (!supabase) return null;
    const row = mapClientToRow(client);
    const { error } = await supabase.from('clients').insert([row]);
    if (error) {
      console.error('Error creating client in Supabase:', error);
      return null;
    }
    return client;
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<boolean> {
    if (!supabase) return false;
    const rowUpdates: any = {};
    if (updates.fullName !== undefined) rowUpdates.full_name = updates.fullName;
    if (updates.commercialName !== undefined) rowUpdates.commercial_name = updates.commercialName;
    if (updates.profession !== undefined) rowUpdates.profession = updates.profession;
    if (updates.email !== undefined) rowUpdates.email = updates.email;
    if (updates.whatsapp !== undefined) rowUpdates.whatsapp = updates.whatsapp;
    if (updates.instagram !== undefined) rowUpdates.instagram = updates.instagram;
    if (updates.linkedin !== undefined) rowUpdates.linkedin = updates.linkedin;
    if (updates.city !== undefined) rowUpdates.city = updates.city;
    if (updates.country !== undefined) rowUpdates.country = updates.country;
    if (updates.photoUrl !== undefined) rowUpdates.photo_url = updates.photoUrl;
    if (updates.status !== undefined) rowUpdates.status = updates.status;
    if (updates.bio !== undefined) rowUpdates.bio = updates.bio;
    if (updates.shortDescription !== undefined) rowUpdates.short_description = updates.shortDescription;
    if (updates.specialties !== undefined) rowUpdates.specialties = updates.specialties;
    if (updates.locationDetails !== undefined) rowUpdates.location_details = updates.locationDetails;
    if (updates.workingHours !== undefined) rowUpdates.working_hours = updates.workingHours;
    if (updates.contractedProduct !== undefined) rowUpdates.contracted_product = updates.contractedProduct;
    if (updates.price !== undefined) rowUpdates.price = updates.price;
    if (updates.paymentMethod !== undefined) rowUpdates.payment_method = updates.paymentMethod;
    if (updates.paymentStatus !== undefined) rowUpdates.payment_status = updates.paymentStatus;
    if (updates.renewalDate !== undefined) rowUpdates.renewal_date = updates.renewalDate;
    if (updates.commercialNotes !== undefined) rowUpdates.commercial_notes = updates.commercialNotes;
    if (updates.primaryDomain !== undefined) rowUpdates.primary_domain = updates.primaryDomain;
    if (updates.domainRegistrar !== undefined) rowUpdates.domain_registrar = updates.domainRegistrar;
    if (updates.domainExpiration !== undefined) rowUpdates.domain_expiration = updates.domainExpiration;
    if (updates.dnsNameservers !== undefined) rowUpdates.dns_nameservers = updates.dnsNameservers;
    if (updates.nicDelegationStatus !== undefined) rowUpdates.nic_delegation_status = updates.nicDelegationStatus;
    if (updates.nicAuthCode !== undefined) rowUpdates.nic_auth_code = updates.nicAuthCode;
    if (updates.cloudflareProject !== undefined) rowUpdates.cloudflare_project = updates.cloudflareProject;
    if (updates.cloudflareZoneId !== undefined) rowUpdates.cloudflare_zone_id = updates.cloudflareZoneId;
    if (updates.githubRepoName !== undefined) rowUpdates.github_repo_name = updates.githubRepoName;
    if (updates.framework !== undefined) rowUpdates.framework = updates.framework;
    if (updates.content !== undefined) rowUpdates.content = updates.content;

    const { error } = await supabase.from('clients').update(rowUpdates).eq('id', id);
    if (error) {
      console.error('Error updating client in Supabase:', error);
      return false;
    }
    return true;
  },

  async deleteClient(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      await supabase.from('projects').delete().eq('client_id', id);
      await supabase.from('webs').delete().eq('client_id', id);
      await supabase.from('domains').delete().eq('client_id', id);
      await supabase.from('tasks').delete().eq('client_id', id);
      await supabase.from('activity_logs').delete().eq('client_id', id);
    } catch (e) {
      console.warn('Error clearing related client tables in Supabase:', e);
    }

    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      console.error('Error deleting client from Supabase:', error);
      return false;
    }
    return true;
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((row: any) => ({
      id: row.id,
      clientId: row.client_id,
      clientName: row.client_name,
      name: row.name,
      projectType: row.project_type,
      status: row.status,
      startDate: row.start_date,
      estimatedDeliveryDate: row.estimated_delivery_date,
      realDeliveryDate: row.real_delivery_date,
      price: row.price,
      responsible: row.responsible,
      notes: row.notes,
      checklist: row.checklist || [],
      createdAt: row.created_at,
    }));
  },

  async createProject(project: Project): Promise<Project | null> {
    if (!supabase) return null;
    const { error } = await supabase.from('projects').insert([
      {
        id: project.id,
        client_id: project.clientId,
        client_name: project.clientName,
        name: project.name,
        project_type: project.projectType,
        status: project.status,
        start_date: project.startDate,
        estimated_delivery_date: project.estimatedDeliveryDate,
        real_delivery_date: project.realDeliveryDate,
        price: project.price,
        responsible: project.responsible,
        notes: project.notes,
        checklist: project.checklist,
        created_at: project.createdAt,
      },
    ]);
    return error ? null : project;
  },

  // WEBS
  async getWebs(): Promise<WebSite[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('webs').select('*');
    if (error) return [];
    return (data || []).map((row: any) => ({
      id: row.id,
      clientId: row.client_id,
      clientName: row.client_name,
      projectId: row.project_id,
      projectName: row.project_name,
      siteName: row.site_name,
      primaryDomain: row.primary_domain,
      secondaryDomains: row.secondary_domains || [],
      productionUrl: row.production_url || '',
      previewUrl: row.preview_url || '',
      githubRepoName: row.github_repo_name || '',
      githubRepoUrl: row.github_repo_url || '',
      cloudflareProject: row.cloudflare_project || '',
      status: row.status,
      publishedAt: row.published_at,
      lastUpdatedAt: row.last_updated_at,
      framework: row.framework,
      technicalNotes: row.technical_notes || '',
    }));
  },

  async createWeb(web: WebSite): Promise<WebSite | null> {
    if (!supabase) return null;
    const { error } = await supabase.from('webs').insert([
      {
        id: web.id,
        client_id: web.clientId,
        client_name: web.clientName,
        project_id: web.projectId,
        project_name: web.projectName,
        site_name: web.siteName,
        primary_domain: web.primaryDomain,
        secondary_domains: web.secondaryDomains,
        production_url: web.productionUrl,
        preview_url: web.previewUrl,
        github_repo_name: web.githubRepoName,
        github_repo_url: web.githubRepoUrl,
        cloudflare_project: web.cloudflareProject,
        status: web.status,
        published_at: web.publishedAt,
        last_updated_at: web.lastUpdatedAt,
        framework: web.framework,
        technical_notes: web.technicalNotes,
      },
    ]);
    return error ? null : web;
  },

  // DOMAINS
  async getDomains(): Promise<Domain[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('domains').select('*').order('expiration_date', { ascending: true });
    if (error) return [];
    return (data || []).map((row: any) => ({
      id: row.id,
      domainName: row.domain_name,
      clientId: row.client_id,
      clientName: row.client_name,
      domainType: row.domain_type,
      registrar: row.registrar,
      owner: row.owner,
      managedBy: row.managed_by,
      dnsNameservers: row.dns_nameservers || [],
      nicDelegationStatus: row.nic_delegation_status,
      registeredDate: row.registered_date,
      expirationDate: row.expiration_date,
      status: row.status,
      notes: row.notes || '',
      autoRenew: row.auto_renew || false,
    }));
  },

  async createDomain(domain: Domain): Promise<Domain | null> {
    if (!supabase) return null;
    const { error } = await supabase.from('domains').insert([
      {
        id: domain.id,
        domain_name: domain.domainName,
        client_id: domain.clientId,
        client_name: domain.clientName,
        domain_type: domain.domainType,
        registrar: domain.registrar,
        owner: domain.owner,
        managed_by: domain.managedBy,
        dns_nameservers: domain.dnsNameservers,
        nic_delegation_status: domain.nicDelegationStatus,
        registered_date: domain.registeredDate,
        expiration_date: domain.expirationDate,
        status: domain.status,
        notes: domain.notes,
        auto_renew: domain.autoRenew,
      },
    ]);
    return error ? null : domain;
  },

  // TASKS
  async getTasks(): Promise<Task[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
    if (error) return [];
    return (data || []).map((row: any) => ({
      id: row.id,
      clientId: row.client_id,
      clientName: row.client_name,
      projectId: row.project_id,
      projectName: row.project_name,
      title: row.title,
      description: row.description,
      priority: row.priority,
      dueDate: row.due_date,
      completed: row.completed,
      completedAt: row.completed_at,
      assignedTo: row.assigned_to,
      createdAt: row.created_at,
    }));
  },

  async createTask(task: Task): Promise<Task | null> {
    if (!supabase) return null;
    const { error } = await supabase.from('tasks').insert([
      {
        id: task.id,
        client_id: task.clientId,
        client_name: task.clientName,
        project_id: task.projectId,
        project_name: task.projectName,
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.dueDate,
        completed: task.completed,
        completed_at: task.completedAt,
        assigned_to: task.assignedTo,
        created_at: task.createdAt,
      },
    ]);
    return error ? null : task;
  },
};

function mapRowToClient(row: any): Client {
  return {
    id: row.id,
    fullName: row.full_name,
    commercialName: row.commercial_name || '',
    profession: row.profession,
    email: row.email || '',
    whatsapp: row.whatsapp || '',
    instagram: row.instagram || '',
    linkedin: row.linkedin || '',
    city: row.city || '',
    country: row.country || 'Argentina',
    photoUrl: row.photo_url || '',
    status: row.status || 'Prospecto',
    createdAt: row.created_at,
    lastContact: row.last_contact || row.created_at,
    specialties: row.specialties || [],
    bio: row.bio || '',
    shortDescription: row.short_description || '',
    experienceSummary: row.experience_summary || '',
    educationSummary: row.education_summary || '',
    locationDetails: row.location_details || '',
    workingHours: row.working_hours || '',
    contractedProduct: row.contracted_product || '',
    price: row.price || '',
    paymentMethod: row.payment_method || '',
    contractDate: row.contract_date || row.created_at,
    paymentStatus: row.payment_status || 'Pendiente',
    renewalDate: row.renewal_date,
    commercialNotes: row.commercial_notes || '',
    primaryDomain: row.primary_domain || '',
    domainRegistrar: row.domain_registrar || 'NIC Argentina',
    domainExpiration: row.domain_expiration,
    dnsNameservers: row.dns_nameservers || [],
    nicDelegationStatus: row.nic_delegation_status || 'Pendiente de Delegación en NIC',
    nicAuthCode: row.nic_auth_code || '',
    cloudflareProject: row.cloudflare_project || '',
    cloudflareZoneId: row.cloudflare_zone_id || '',
    productionUrl: row.production_url || '',
    tempPreviewUrl: row.temp_preview_url || '',
    githubRepoName: row.github_repo_name || '',
    githubRepoUrl: row.github_repo_url || '',
    framework: row.framework || 'Astro + Tailwind CSS',
    deploymentStatus: row.deployment_status || 'No inicializado',
    content: row.content || {
      identity: { name: row.full_name, profession: row.profession, colors: ['#18181B'], fonts: 'Inter', isComplete: false },
      presentation: { bio: '', shortDescription: '', mainSlogan: '', isComplete: false },
      services: { items: [], isComplete: false },
      education: { items: [], isComplete: false },
      experience: { items: [], isComplete: false },
      contact: { whatsapp: row.whatsapp, email: row.email, location: row.city, isComplete: false },
      portfolio: { items: [], isComplete: false },
    },
  };
}

function mapClientToRow(client: Client): any {
  return {
    id: client.id,
    full_name: client.fullName,
    commercial_name: client.commercialName,
    profession: client.profession,
    email: client.email,
    whatsapp: client.whatsapp,
    instagram: client.instagram,
    linkedin: client.linkedin,
    city: client.city,
    country: client.country,
    photo_url: client.photoUrl,
    status: client.status,
    created_at: client.createdAt,
    last_contact: client.lastContact,
    specialties: client.specialties,
    bio: client.bio,
    short_description: client.shortDescription,
    experience_summary: client.experienceSummary,
    education_summary: client.educationSummary,
    location_details: client.locationDetails,
    working_hours: client.workingHours,
    contracted_product: client.contractedProduct,
    price: client.price,
    payment_method: client.paymentMethod,
    contract_date: client.contractDate,
    payment_status: client.paymentStatus,
    renewal_date: client.renewalDate,
    commercial_notes: client.commercialNotes,
    primary_domain: client.primaryDomain,
    domain_registrar: client.domainRegistrar,
    domain_expiration: client.domainExpiration,
    dns_nameservers: client.dnsNameservers,
    nic_delegation_status: client.nicDelegationStatus,
    nic_auth_code: client.nicAuthCode,
    cloudflare_project: client.cloudflareProject,
    cloudflare_zone_id: client.cloudflareZoneId,
    production_url: client.productionUrl,
    temp_preview_url: client.tempPreviewUrl,
    github_repo_name: client.githubRepoName,
    github_repo_url: client.githubRepoUrl,
    framework: client.framework,
    deployment_status: client.deploymentStatus,
    content: client.content,
  };
}
