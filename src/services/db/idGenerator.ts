import { Client, Project, WebSite, Domain, Task } from '../../types';

/**
 * Standard ID generator for TRAYECTORIA internal operations:
 * - Clients: TRAY-00001, TRAY-00002, etc.
 * - Projects: TRAY-00001-P01, TRAY-00001-P02, etc.
 * - Webs: TRAY-00001-W01, TRAY-00001-W02, etc.
 * - Domains: TRAY-00001-D01, TRAY-00001-D02, etc.
 * - Tasks: TASK-001, TASK-002, etc.
 */

export function generateNextClientId(existingClients: Client[]): string {
  let maxNum = 0;
  for (const client of existingClients) {
    const match = client.id.match(/^TRAY-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  return `TRAY-${String(nextNum).padStart(5, '0')}`;
}

export function generateNextProjectId(clientId: string, existingProjects: Project[]): string {
  const clientProjects = existingProjects.filter((p) => p.clientId === clientId);
  let maxIndex = 0;
  for (const project of clientProjects) {
    const match = project.id.match(/P(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxIndex) maxIndex = num;
    }
  }
  const nextIndex = maxIndex + 1;
  return `${clientId}-P${String(nextIndex).padStart(2, '0')}`;
}

export function generateNextWebId(clientId: string, existingWebs: WebSite[]): string {
  const clientWebs = existingWebs.filter((w) => w.clientId === clientId);
  let maxIndex = 0;
  for (const web of clientWebs) {
    const match = web.id.match(/W(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxIndex) maxIndex = num;
    }
  }
  const nextIndex = maxIndex + 1;
  return `${clientId}-W${String(nextIndex).padStart(2, '0')}`;
}

export function generateNextDomainId(clientId: string, existingDomains: Domain[]): string {
  const clientDomains = existingDomains.filter((d) => d.clientId === clientId);
  let maxIndex = 0;
  for (const domain of clientDomains) {
    const match = domain.id.match(/D(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxIndex) maxIndex = num;
    }
  }
  const nextIndex = maxIndex + 1;
  return `${clientId}-D${String(nextIndex).padStart(2, '0')}`;
}

export function generateNextTaskId(existingTasks: Task[]): string {
  let maxNum = 0;
  for (const task of existingTasks) {
    const match = task.id.match(/^TASK-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  return `TASK-${String(nextNum).padStart(3, '0')}`;
}
