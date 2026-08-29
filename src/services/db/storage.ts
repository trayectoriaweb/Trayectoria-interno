import { Client, Project, WebSite, Domain, Task, ActivityLog, InternalNote } from '../../types';
import {
  initialClients,
  initialProjects,
  initialWebs,
  initialDomains,
  initialTasks,
  initialActivityLogs,
  initialInternalNotes,
} from './seedData';
import { isSupabaseConfigured } from '../supabase/client';
import { supabaseDb } from '../supabase/dbService';

export interface DatabaseState {
  clients: Client[];
  projects: Project[];
  webs: WebSite[];
  domains: Domain[];
  tasks: Task[];
  activityLogs: ActivityLog[];
  notes: InternalNote[];
  version: number;
}

const STORAGE_KEY = isSupabaseConfigured
  ? 'trayectoria_internal_db_supabase_v1'
  : 'trayectoria_internal_db_v1';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function getInitialState(): DatabaseState {
  // If connected to real Supabase, start completely clean (0 fake data)
  if (isSupabaseConfigured) {
    return {
      clients: [],
      projects: [],
      webs: [],
      domains: [],
      tasks: [],
      activityLogs: [],
      notes: [],
      version: 1,
    };
  }

  // Demo fallback
  return {
    clients: initialClients,
    projects: initialProjects,
    webs: initialWebs,
    domains: initialDomains,
    tasks: initialTasks,
    activityLogs: initialActivityLogs,
    notes: initialInternalNotes,
    version: 1,
  };
}

export function loadDatabase(): DatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveDatabase(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as DatabaseState;
    if (!parsed.clients || !Array.isArray(parsed.clients)) {
      return getInitialState();
    }
    return parsed;
  } catch (error) {
    console.error('Error loading database from localStorage:', error);
    return getInitialState();
  }
}

export function saveDatabase(state: DatabaseState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notifyListeners();
  } catch (error) {
    console.error('Error saving database to localStorage:', error);
  }
}

export function resetDatabase(): DatabaseState {
  const initial = getInitialState();
  saveDatabase(initial);
  return initial;
}

export function clearDatabase(): DatabaseState {
  const empty: DatabaseState = {
    clients: [],
    projects: [],
    webs: [],
    domains: [],
    tasks: [],
    activityLogs: [],
    notes: [],
    version: 1,
  };
  saveDatabase(empty);
  return empty;
}

export function exportDatabaseJson(): string {
  const state = loadDatabase();
  return JSON.stringify(state, null, 2);
}

export function importDatabaseJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString) as DatabaseState;
    if (parsed.clients && parsed.projects && parsed.webs && parsed.domains) {
      saveDatabase(parsed);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Import error:', e);
    return false;
  }
}

export function subscribeToDatabase(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Listener error', e);
    }
  });
}

// Initial async sync from Supabase
if (isSupabaseConfigured) {
  (async () => {
    try {
      const [remoteClients, remoteProjects, remoteWebs, remoteDomains, remoteTasks] = await Promise.all([
        supabaseDb.getClients(),
        supabaseDb.getProjects(),
        supabaseDb.getWebs(),
        supabaseDb.getDomains(),
        supabaseDb.getTasks(),
      ]);

      const state = loadDatabase();
      if (remoteClients && remoteClients.length > 0) state.clients = remoteClients;
      if (remoteProjects && remoteProjects.length > 0) state.projects = remoteProjects;
      if (remoteWebs && remoteWebs.length > 0) state.webs = remoteWebs;
      if (remoteDomains && remoteDomains.length > 0) state.domains = remoteDomains;
      if (remoteTasks && remoteTasks.length > 0) state.tasks = remoteTasks;

      saveDatabase(state);
    } catch (err) {
      console.warn('Supabase initial fetch warning (normal if tables are not yet created):', err);
    }
  })();
}
