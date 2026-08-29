import {
  Client,
  Project,
  WebSite,
  Domain,
  Task,
  ActivityLog,
  InternalNote,
  AppStatistics,
  ChecklistItem,
} from '../../types';
import { loadDatabase, saveDatabase } from './storage';
import {
  generateNextClientId,
  generateNextProjectId,
  generateNextWebId,
  generateNextDomainId,
  generateNextTaskId,
} from './idGenerator';
import { initialChecklistTemplate } from './seedData';
import { isSupabaseConfigured } from '../supabase/client';
import { supabaseDb } from '../supabase/dbService';

export interface GlobalSearchResult {
  type: 'client' | 'project' | 'web' | 'domain' | 'task';
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  targetClientId?: string;
}

export const db = {
  // CLIENTS
  getClients(): Client[] {
    return loadDatabase().clients;
  },

  getClientById(id: string): Client | undefined {
    return loadDatabase().clients.find((c) => c.id === id);
  },

  createClient(
    data: Omit<Client, 'id' | 'createdAt' | 'content'> & { content?: Client['content'] }
  ): Client {
    const state = loadDatabase();
    const newId = generateNextClientId(state.clients);
    const today = new Date().toISOString().split('T')[0];

    const defaultContent: Client['content'] = data.content || {
      identity: {
        name: data.commercialName || data.fullName,
        profession: data.profession,
        colors: ['#18181B', '#FAFAFA'],
        fonts: 'Inter',
        isComplete: false,
      },
      presentation: {
        bio: data.bio || '',
        shortDescription: data.shortDescription || '',
        mainSlogan: '',
        isComplete: false,
      },
      services: {
        items: [],
        isComplete: false,
      },
      education: {
        items: [],
        isComplete: false,
      },
      experience: {
        items: [],
        isComplete: false,
      },
      contact: {
        whatsapp: data.whatsapp,
        email: data.email,
        instagram: data.instagram,
        linkedin: data.linkedin,
        location: `${data.city}, ${data.country}`,
        isComplete: !!(data.whatsapp && data.email),
      },
      portfolio: {
        items: [],
        isComplete: false,
      },
    };

    const newClient: Client = {
      ...data,
      id: newId,
      createdAt: today,
      lastContact: today,
      content: defaultContent,
    };

    state.clients.unshift(newClient);

    // Auto-create initial project for this client
    const newProjectId = generateNextProjectId(newId, state.projects);
    const newProject: Project = {
      id: newProjectId,
      clientId: newId,
      clientName: newClient.fullName,
      name: `${newClient.commercialName || newClient.fullName} — Web Principal`,
      projectType: 'Sitio Web Completo',
      status: 'Esperando contenido',
      startDate: today,
      estimatedDeliveryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      price: data.price || '$400 USD',
      responsible: 'Operaciones Trayectoria',
      notes: 'Proyecto inicial generado automáticamente al dar de alta el cliente.',
      checklist: initialChecklistTemplate.map((item) => ({ ...item, completed: false })),
      createdAt: today,
    };
    state.projects.unshift(newProject);

    // Log Activity
    const newActivity: ActivityLog = {
      id: `ACT-${Date.now().toString().slice(-5)}`,
      clientId: newId,
      clientName: newClient.fullName,
      projectId: newProjectId,
      type: 'client_created',
      title: 'Nuevo cliente dado de alta',
      description: `Se registró la ficha de ${newClient.fullName} (${newClient.profession}) y se creó el proyecto ${newProjectId}.`,
      date: today,
      author: 'Operaciones',
    };
    state.activityLogs.unshift(newActivity);

    saveDatabase(state);

    if (isSupabaseConfigured) {
      supabaseDb.createClient(newClient);
      supabaseDb.createProject(newProject);
    }

    return newClient;
  },

  updateClient(id: string, updates: Partial<Client>): Client | null {
    const state = loadDatabase();
    const index = state.clients.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const oldClient = state.clients[index];
    const updatedClient: Client = { ...oldClient, ...updates };
    state.clients[index] = updatedClient;

    // Update synced client names in related projects, webs, domains, tasks
    if (updates.fullName && updates.fullName !== oldClient.fullName) {
      state.projects.forEach((p) => {
        if (p.clientId === id) p.clientName = updates.fullName!;
      });
      state.webs.forEach((w) => {
        if (w.clientId === id) w.clientName = updates.fullName!;
      });
      state.domains.forEach((d) => {
        if (d.clientId === id) d.clientName = updates.fullName!;
      });
      state.tasks.forEach((t) => {
        if (t.clientId === id) t.clientName = updates.fullName!;
      });
    }

    // If status changed, log activity
    if (updates.status && updates.status !== oldClient.status) {
      state.activityLogs.unshift({
        id: `ACT-${Date.now().toString().slice(-5)}`,
        clientId: id,
        clientName: updatedClient.fullName,
        type: 'status_change',
        title: 'Estado del cliente actualizado',
        description: `Estado modificado de "${oldClient.status}" a "${updates.status}".`,
        date: new Date().toISOString().split('T')[0],
        author: 'Operaciones',
      });
    }

    saveDatabase(state);

    if (isSupabaseConfigured) {
      supabaseDb.updateClient(id, updates);
    }

    return updatedClient;
  },

  deleteClient(id: string): boolean {
    const state = loadDatabase();
    state.clients = state.clients.filter((c) => c.id !== id);
    state.projects = state.projects.filter((p) => p.clientId !== id);
    state.webs = state.webs.filter((w) => w.clientId !== id);
    state.domains = state.domains.filter((d) => d.clientId !== id);
    state.tasks = state.tasks.filter((t) => t.clientId !== id);
    state.notes = state.notes.filter((n) => n.clientId !== id);
    saveDatabase(state);

    if (isSupabaseConfigured) {
      supabaseDb.deleteClient(id);
    }

    return true;
  },

  // PROJECTS
  getProjects(): Project[] {
    return loadDatabase().projects;
  },

  getProjectsByClient(clientId: string): Project[] {
    return loadDatabase().projects.filter((p) => p.clientId === clientId);
  },

  createProject(data: Omit<Project, 'id' | 'createdAt' | 'checklist'> & { checklist?: ChecklistItem[] }): Project {
    const state = loadDatabase();
    const newId = generateNextProjectId(data.clientId, state.projects);
    const today = new Date().toISOString().split('T')[0];

    const newProject: Project = {
      ...data,
      id: newId,
      createdAt: today,
      checklist: data.checklist || initialChecklistTemplate.map((item) => ({ ...item, completed: false })),
    };

    state.projects.unshift(newProject);
    saveDatabase(state);
    if (isSupabaseConfigured) {
      supabaseDb.createProject(newProject);
    }
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const state = loadDatabase();
    const index = state.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const old = state.projects[index];
    const updated: Project = { ...old, ...updates };
    state.projects[index] = updated;

    if (updates.status && updates.status !== old.status) {
      state.activityLogs.unshift({
        id: `ACT-${Date.now().toString().slice(-5)}`,
        clientId: old.clientId,
        clientName: old.clientName,
        projectId: old.id,
        type: 'status_change',
        title: `Proyecto ${old.id} pasó a ${updates.status}`,
        description: `Estado del proyecto "${old.name}" actualizado a ${updates.status}.`,
        date: new Date().toISOString().split('T')[0],
        author: 'Operaciones',
      });
    }

    saveDatabase(state);
    return updated;
  },

  // WEBS
  getWebs(): WebSite[] {
    return loadDatabase().webs;
  },

  getWebsByClient(clientId: string): WebSite[] {
    return loadDatabase().webs.filter((w) => w.clientId === clientId);
  },

  createWeb(data: Omit<WebSite, 'id' | 'lastUpdatedAt'>): WebSite {
    const state = loadDatabase();
    const newId = generateNextWebId(data.clientId, state.webs);
    const today = new Date().toISOString().split('T')[0];

    const newWeb: WebSite = {
      ...data,
      id: newId,
      lastUpdatedAt: today,
    };

    state.webs.unshift(newWeb);

    // If published, log
    if (newWeb.status === 'Publicada') {
      state.activityLogs.unshift({
        id: `ACT-${Date.now().toString().slice(-5)}`,
        clientId: newWeb.clientId,
        clientName: newWeb.clientName,
        type: 'web_published',
        title: `Web ${newWeb.primaryDomain} publicada`,
        description: `Sitio web publicado y verificado en Cloudflare Pages / ${newWeb.primaryDomain}`,
        date: today,
        author: 'Operaciones',
      });
    }

    saveDatabase(state);
    if (isSupabaseConfigured) {
      supabaseDb.createWeb(newWeb);
    }
    return newWeb;
  },

  updateWeb(id: string, updates: Partial<WebSite>): WebSite | null {
    const state = loadDatabase();
    const index = state.webs.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const old = state.webs[index];
    const today = new Date().toISOString().split('T')[0];
    const updated: WebSite = {
      ...old,
      ...updates,
      lastUpdatedAt: today,
      publishedAt: updates.status === 'Publicada' && !old.publishedAt ? today : old.publishedAt,
    };
    state.webs[index] = updated;

    if (updates.status === 'Publicada' && old.status !== 'Publicada') {
      state.activityLogs.unshift({
        id: `ACT-${Date.now().toString().slice(-5)}`,
        clientId: old.clientId,
        clientName: old.clientName,
        type: 'web_published',
        title: `Web ${old.primaryDomain} publicada`,
        description: `El sitio web fue marcado como Publicada con éxito.`,
        date: today,
        author: 'Operaciones',
      });
    }

    saveDatabase(state);
    return updated;
  },

  deleteWeb(id: string): boolean {
    const state = loadDatabase();
    state.webs = state.webs.filter((w) => w.id !== id);
    saveDatabase(state);
    return true;
  },

  // DOMAINS
  getDomains(): Domain[] {
    return loadDatabase().domains;
  },

  getDomainsByClient(clientId: string): Domain[] {
    return loadDatabase().domains.filter((d) => d.clientId === clientId);
  },

  createDomain(data: Omit<Domain, 'id'>): Domain {
    const state = loadDatabase();
    const newId = generateNextDomainId(data.clientId, state.domains);

    const newDomain: Domain = {
      ...data,
      id: newId,
    };

    state.domains.unshift(newDomain);
    saveDatabase(state);
    if (isSupabaseConfigured) {
      supabaseDb.createDomain(newDomain);
    }
    return newDomain;
  },

  updateDomain(id: string, updates: Partial<Domain>): Domain | null {
    const state = loadDatabase();
    const index = state.domains.findIndex((d) => d.id === id);
    if (index === -1) return null;

    state.domains[index] = { ...state.domains[index], ...updates };
    saveDatabase(state);
    return state.domains[index];
  },

  deleteDomain(id: string): boolean {
    const state = loadDatabase();
    state.domains = state.domains.filter((d) => d.id !== id);
    saveDatabase(state);
    return true;
  },

  // TASKS
  getTasks(): Task[] {
    return loadDatabase().tasks;
  },

  createTask(data: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>): Task {
    const state = loadDatabase();
    const newId = generateNextTaskId(state.tasks);
    const today = new Date().toISOString().split('T')[0];

    const newTask: Task = {
      ...data,
      id: newId,
      completed: false,
      createdAt: today,
    };

    state.tasks.unshift(newTask);
    saveDatabase(state);
    if (isSupabaseConfigured) {
      supabaseDb.createTask(newTask);
    }
    return newTask;
  },

  toggleTask(id: string): Task | null {
    const state = loadDatabase();
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return null;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString().split('T')[0] : undefined;

    if (task.completed) {
      state.activityLogs.unshift({
        id: `ACT-${Date.now().toString().slice(-5)}`,
        clientId: task.clientId,
        clientName: task.clientName,
        projectId: task.projectId,
        type: 'task_completed',
        title: 'Tarea completada',
        description: `Tarea finalizada: "${task.title}"`,
        date: new Date().toISOString().split('T')[0],
        author: 'Operaciones',
      });
    }

    saveDatabase(state);
    return task;
  },

  deleteTask(id: string): boolean {
    const state = loadDatabase();
    state.tasks = state.tasks.filter((t) => t.id !== id);
    saveDatabase(state);
    return true;
  },

  // ACTIVITY LOGS
  getActivityLogs(): ActivityLog[] {
    return loadDatabase().activityLogs;
  },

  getActivityLogsByClient(clientId: string): ActivityLog[] {
    return loadDatabase().activityLogs.filter((a) => a.clientId === clientId);
  },

  addActivityLog(data: Omit<ActivityLog, 'id'>): ActivityLog {
    const state = loadDatabase();
    const newLog: ActivityLog = {
      ...data,
      id: `ACT-${Date.now().toString().slice(-6)}`,
    };
    state.activityLogs.unshift(newLog);
    saveDatabase(state);
    return newLog;
  },

  // INTERNAL NOTES
  getNotesByClient(clientId: string): InternalNote[] {
    return loadDatabase().notes.filter((n) => n.clientId === clientId);
  },

  addNote(clientId: string, content: string, author = 'Operaciones Trayectoria'): InternalNote {
    const state = loadDatabase();
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newNote: InternalNote = {
      id: `NOTE-${Date.now().toString().slice(-6)}`,
      clientId,
      author,
      content,
      createdAt: formatted,
    };

    state.notes.unshift(newNote);
    saveDatabase(state);
    return newNote;
  },

  deleteNote(id: string): boolean {
    const state = loadDatabase();
    state.notes = state.notes.filter((n) => n.id !== id);
    saveDatabase(state);
    return true;
  },

  // STATISTICS
  getStatistics(): AppStatistics {
    const state = loadDatabase();
    const clients = state.clients;
    const projects = state.projects;
    const webs = state.webs;
    const domains = state.domains;
    const tasks = state.tasks;

    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.status === 'Activo' || c.status === 'En producción').length;
    const projectsInProduction = projects.filter((p) => p.status === 'Publicado' || p.status === 'En revisión').length;
    const pendingProjects = projects.filter(
      (p) => p.status === 'Pendiente' || p.status === 'Esperando contenido' || p.status === 'En desarrollo' || p.status === 'En diseño'
    ).length;
    const activeWebs = webs.filter((w) => w.status === 'Publicada' || w.status === 'Preview').length;

    // Domains expiring in < 60 days
    const now = new Date();
    const expiringDomainsCount = domains.filter((d) => {
      const exp = new Date(d.expirationDate);
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 60;
    }).length;

    const pendingTasksCount = tasks.filter((t) => !t.completed).length;

    const clientsWaitingContent = clients.filter(
      (c) =>
        c.status === 'En producción' ||
        c.status === 'Contactado' ||
        !c.content.portfolio.isComplete ||
        !c.content.identity.isComplete ||
        !c.content.services.isComplete
    ).length;

    return {
      totalClients,
      activeClients,
      projectsInProduction,
      pendingProjects,
      activeWebs,
      expiringDomainsCount,
      pendingTasksCount,
      clientsWaitingContent,
    };
  },

  // GLOBAL SEARCH (Fast lookup across all entities)
  searchAll(query: string): GlobalSearchResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const state = loadDatabase();
    const results: GlobalSearchResult[] = [];

    // Search Clients
    for (const client of state.clients) {
      if (
        client.id.toLowerCase().includes(q) ||
        client.fullName.toLowerCase().includes(q) ||
        client.commercialName.toLowerCase().includes(q) ||
        client.email.toLowerCase().includes(q) ||
        client.whatsapp.toLowerCase().includes(q) ||
        client.profession.toLowerCase().includes(q) ||
        (client.primaryDomain && client.primaryDomain.toLowerCase().includes(q)) ||
        (client.githubRepoName && client.githubRepoName.toLowerCase().includes(q)) ||
        (client.cloudflareProject && client.cloudflareProject.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'client',
          id: client.id,
          title: client.fullName,
          subtitle: `${client.commercialName || client.profession} • ${client.primaryDomain || client.email}`,
          badge: client.status,
          targetClientId: client.id,
        });
      }
    }

    // Search Projects
    for (const project of state.projects) {
      if (
        project.id.toLowerCase().includes(q) ||
        project.name.toLowerCase().includes(q) ||
        project.clientName.toLowerCase().includes(q) ||
        project.projectType.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'project',
          id: project.id,
          title: project.name,
          subtitle: `Cliente: ${project.clientName} (${project.id})`,
          badge: project.status,
          targetClientId: project.clientId,
        });
      }
    }

    // Search Webs
    for (const web of state.webs) {
      if (
        web.id.toLowerCase().includes(q) ||
        web.primaryDomain.toLowerCase().includes(q) ||
        web.githubRepoName.toLowerCase().includes(q) ||
        web.cloudflareProject.toLowerCase().includes(q) ||
        web.siteName.toLowerCase().includes(q) ||
        web.clientName.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'web',
          id: web.id,
          title: web.primaryDomain || web.siteName,
          subtitle: `Repo: ${web.githubRepoName} • Cloudflare: ${web.cloudflareProject}`,
          badge: web.status,
          targetClientId: web.clientId,
        });
      }
    }

    // Search Domains
    for (const domain of state.domains) {
      if (
        domain.id.toLowerCase().includes(q) ||
        domain.domainName.toLowerCase().includes(q) ||
        domain.clientName.toLowerCase().includes(q) ||
        domain.registrar.toLowerCase().includes(q) ||
        domain.owner.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'domain',
          id: domain.id,
          title: domain.domainName,
          subtitle: `${domain.registrar} • Titular: ${domain.owner}`,
          badge: domain.status,
          targetClientId: domain.clientId,
        });
      }
    }

    // Search Tasks
    for (const task of state.tasks) {
      if (
        task.id.toLowerCase().includes(q) ||
        task.title.toLowerCase().includes(q) ||
        (task.clientName && task.clientName.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title,
          subtitle: `Vence: ${task.dueDate} • ${task.clientName || 'General'}`,
          badge: task.priority,
          targetClientId: task.clientId,
        });
      }
    }

    return results.slice(0, 15);
  },

  // SYNC ONBOARDING SUBMISSIONS AUTOMATICALLY INTO CLIENTS
  syncOnboardingSubmissions(): number {
    const state = loadDatabase();
    let newClientsCount = 0;
    const today = new Date().toISOString().split('T')[0];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('trayectoria_onboarding_TRAY-')) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;

          const submission = JSON.parse(raw);
          const clientId = submission.clientId;
          if (!clientId) continue;

          const p = submission.personalInfo || {};
          if (!p.nombre && !p.profesion) continue;

          const fullName = `${p.nombre || ''} ${p.apellido || ''}`.trim() || 'Nuevo Cliente';
          const commercialName = p.nombreEnSitio || p.nombreProfesional || fullName;
          const profession = p.profesion || 'Profesional';

          const existingIndex = state.clients.findIndex((c) => c.id === clientId);

          const mappedContent: Client['content'] = {
            identity: {
              name: commercialName,
              profession: profession,
              colors: submission.style?.coloresPreferidos
                ? [submission.style.coloresPreferidos]
                : ['#0033FF', '#FFFFFF'],
              fonts: 'Plus Jakarta Sans',
              isComplete: !!(p.nombre && p.profesion),
            },
            presentation: {
              bio: submission.history?.presentacionCorta || '',
              shortDescription: p.especialidadPrincipal || '',
              mainSlogan: commercialName,
              isComplete: !!submission.history?.presentacionCorta,
            },
            services: {
              items: (submission.offer?.servicios || []).map((s: any, idx: number) => ({
                id: s.id || `srv-${idx}`,
                title: s.nombre,
                description: s.descripcion,
                price: '',
              })),
              isComplete: (submission.offer?.servicios?.length || 0) > 0,
            },
            education: {
              items: (submission.history?.formacion || []).map((f: any, idx: number) => ({
                id: f.id || `for-${idx}`,
                degree: f.carrera,
                institution: f.institucion,
                year: f.anio,
              })),
              isComplete: (submission.history?.formacion?.length || 0) > 0,
            },
            experience: {
              items: (submission.history?.experiencias || []).map((e: any, idx: number) => ({
                id: e.id || `exp-${idx}`,
                role: e.rol,
                company: e.lugar,
                period: e.anio,
                description: e.descripcion,
              })),
              isComplete: (submission.history?.experiencias?.length || 0) > 0,
            },
            contact: {
              whatsapp: submission.contact?.whatsapp || p.whatsapp || '',
              email: submission.contact?.email || p.email || '',
              instagram: submission.contact?.instagram || '',
              linkedin: submission.contact?.linkedin || '',
              location: submission.contact?.ubicacion?.ciudad || p.ciudad || 'Buenos Aires',
              isComplete: !!(submission.contact?.whatsapp || submission.contact?.email),
            },
            portfolio: {
              items: (submission.offer?.proyectos || []).map((pr: any, idx: number) => ({
                id: pr.id || `pro-${idx}`,
                title: pr.nombre,
                category: profession,
                year: pr.anio,
                description: pr.descripcion,
                link: pr.url,
                images: [],
              })),
              isComplete: (submission.offer?.proyectos?.length || 0) > 0,
            },
          };

          if (existingIndex === -1) {
            // Auto-create new client upon onboarding submission
            const newClient: Client = {
              id: clientId,
              fullName,
              commercialName,
              profession,
              status: 'Activo',
              email: submission.contact?.email || p.email || '',
              whatsapp: submission.contact?.whatsapp || p.whatsapp || '',
              instagram: submission.contact?.instagram || '',
              linkedin: submission.contact?.linkedin || '',
              city: p.ciudad || submission.contact?.ubicacion?.ciudad || 'Buenos Aires',
              country: 'Argentina',
              price: '$95 USD',
              createdAt: today,
              lastContact: today,
              internalNotes: `Cliente registrado automáticamente vía Onboarding Web (Estado: ${submission.status}). Sensaciones: ${(submission.style?.sensaciones || []).join(', ')}.`,
              content: mappedContent,
            };

            state.clients.unshift(newClient);

            const newProjectId = generateNextProjectId(clientId, state.projects);
            const newProject: Project = {
              id: newProjectId,
              clientId: clientId,
              clientName: fullName,
              name: `${commercialName} — Web Principal`,
              projectType: 'Sitio Web Completo',
              status: submission.status === 'submitted' ? 'En producción' : 'Esperando contenido',
              startDate: today,
              estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
              price: '$95 USD',
              responsible: 'Operaciones Trayectoria',
              notes: `Proyecto generado automáticamente al recibir la información del cliente.`,
              checklist: initialChecklistTemplate.map((item) => ({ ...item, completed: false })),
              createdAt: today,
            };
            state.projects.unshift(newProject);

            state.activityLogs.unshift({
              id: `ACT-${Date.now().toString().slice(-5)}`,
              clientId: clientId,
              clientName: fullName,
              projectId: newProjectId,
              type: 'client_created',
              title: 'Cliente creado automáticamente vía Onboarding',
              description: `${fullName} (${profession}) completó su información en Trayectoria Web y fue dado de alta con éxito.`,
              date: today,
              author: 'Sistema Onboarding',
            });

            newClientsCount++;
          } else {
            // Update existing client content
            const cl = state.clients[existingIndex];
            cl.fullName = fullName || cl.fullName;
            cl.commercialName = commercialName || cl.commercialName;
            cl.profession = profession || cl.profession;
            cl.whatsapp = submission.contact?.whatsapp || p.whatsapp || cl.whatsapp;
            cl.email = submission.contact?.email || p.email || cl.email;
            cl.content = mappedContent;
          }
        }
      }

      if (newClientsCount > 0) {
        saveDatabase(state);
      }
    } catch (err) {
      console.warn('Error during syncOnboardingSubmissions:', err);
    }

    return newClientsCount;
  },
};

export function getDomainExpirationInfo(expirationDateStr: string): {
  daysLeft: number;
  statusCategory: 'safe' | 'warning' | 'danger' | 'expired';
  label: string;
} {
  const now = new Date();
  const exp = new Date(expirationDateStr);
  const diffTime = exp.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { daysLeft, statusCategory: 'expired', label: `Vencido hace ${Math.abs(daysLeft)} días` };
  }
  if (daysLeft <= 30) {
    return { daysLeft, statusCategory: 'danger', label: `${daysLeft} días restantes (Urgente)` };
  }
  if (daysLeft <= 60) {
    return { daysLeft, statusCategory: 'warning', label: `${daysLeft} días restantes` };
  }
  return { daysLeft, statusCategory: 'safe', label: `${daysLeft} días restantes` };
}

export function calculateContentCompleteness(content: Client['content']): {
  percentage: number;
  isComplete: boolean;
  sections: { name: string; complete: boolean }[];
  missingCount: number;
} {
  const sections = [
    { name: 'Identidad Visual', complete: content.identity.isComplete },
    { name: 'Presentación & Bio', complete: content.presentation.isComplete },
    { name: 'Servicios', complete: content.services.isComplete },
    { name: 'Formación', complete: content.education.isComplete },
    { name: 'Experiencia', complete: content.experience.isComplete },
    { name: 'Contacto & Redes', complete: content.contact.isComplete },
    { name: 'Portfolio / Casos', complete: content.portfolio.isComplete },
  ];

  const completedCount = sections.filter((s) => s.complete).length;
  const percentage = Math.round((completedCount / sections.length) * 100);
  const isComplete = completedCount === sections.length;
  const missingCount = sections.length - completedCount;

  return { percentage, isComplete, sections, missingCount };
}
