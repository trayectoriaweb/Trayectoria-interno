import React, { useState, useEffect } from 'react';
import { Sidebar, NavSection } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';

import { DashboardView } from './components/dashboard/DashboardView';
import { ClientListView } from './components/clients/ClientListView';
import { ClientDetailView } from './components/clients/ClientDetailView';
import { ClientFormModal } from './components/clients/ClientFormModal';

import { ProjectListView } from './components/projects/ProjectListView';
import { ProjectFormModal } from './components/projects/ProjectFormModal';

import { WebListView } from './components/webs/WebListView';
import { WebFormModal } from './components/webs/WebFormModal';

import { DomainListView } from './components/domains/DomainListView';
import { DomainFormModal } from './components/domains/DomainFormModal';

import { TaskListView } from './components/tasks/TaskListView';
import { TaskFormModal } from './components/tasks/TaskFormModal';

import { ActivityListView } from './components/activity/ActivityListView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { OnboardingContainer } from './components/onboarding/OnboardingContainer';

import { db, GlobalSearchResult } from './services/db/repository';
import { subscribeToDatabase } from './services/db/storage';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [onboardingClientId, setOnboardingClientId] = useState<string | null>(null);

  // Global modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewDomainOpen, setIsNewDomainOpen] = useState(false);
  const [isNewWebOpen, setIsNewWebOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // Re-render state on db updates
  const [, setDbTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToDatabase(() => {
      setDbTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  // Listen to URL hash & params for direct /onboarding routes
  useEffect(() => {
    const parseUrlRoute = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const path = window.location.pathname;

      if (hash.startsWith('#/onboarding') || hash.startsWith('#onboarding')) {
        const parts = hash.split('/');
        const id = parts[2] || parts[1]?.replace('onboarding', '').replace('=', '') || '';
        setOnboardingClientId(id || 'demo');
      } else if (search.includes('onboarding=')) {
        const params = new URLSearchParams(search);
        const id = params.get('onboarding');
        setOnboardingClientId(id || 'demo');
      } else if (path.startsWith('/onboarding')) {
        const parts = path.split('/');
        const id = parts[2] || '';
        setOnboardingClientId(id || 'demo');
      }
    };

    parseUrlRoute();
    window.addEventListener('hashchange', parseUrlRoute);
    window.addEventListener('popstate', parseUrlRoute);
    return () => {
      window.removeEventListener('hashchange', parseUrlRoute);
      window.removeEventListener('popstate', parseUrlRoute);
    };
  }, []);

  // Global keyboard shortcut for Command Palette (Cmd/Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (section: NavSection, clientId?: string) => {
    setCurrentSection(section);
    if (clientId) {
      setSelectedClientId(clientId);
    } else {
      setSelectedClientId(null);
    }
  };

  const handleSelectSearchResult = (result: GlobalSearchResult) => {
    if (result.targetClientId) {
      setSelectedClientId(result.targetClientId);
      setCurrentSection('clients');
    } else {
      if (result.type === 'project') setCurrentSection('projects');
      else if (result.type === 'web') setCurrentSection('webs');
      else if (result.type === 'domain') setCurrentSection('domains');
      else if (result.type === 'task') setCurrentSection('tasks');
      else setCurrentSection('clients');
    }
  };

  // If visiting /onboarding directly or previewing
  if (onboardingClientId) {
    return (
      <OnboardingContainer
        clientId={onboardingClientId === 'demo' ? undefined : onboardingClientId}
        onExit={() => {
          window.location.hash = '';
          setOnboardingClientId(null);
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const clientsCount = db.getClients().length;
  const projectsCount = db.getProjects().length;
  const websCount = db.getWebs().length;
  const domainsCount = db.getDomains().length;
  const tasksCount = db.getTasks().filter((t) => !t.completed).length;

  const getSectionTitle = () => {
    if (selectedClientId && currentSection === 'clients') {
      const client = db.getClientById(selectedClientId);
      return client ? `${client.fullName} — Ficha Operativa` : 'Ficha de Cliente';
    }

    switch (currentSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'clients':
        return 'Clientes';
      case 'projects':
        return 'Proyectos';
      case 'webs':
        return 'Webs';
      case 'domains':
        return 'Dominios';
      case 'tasks':
        return 'Tareas';
      case 'activity':
        return 'Actividad';
      case 'settings':
        return 'Configuración';
      default:
        return 'TRAYECTORIA';
    }
  };

  const getSectionSubtitle = () => {
    if (selectedClientId && currentSection === 'clients') {
      return `ID: ${selectedClientId} • Información técnica, comercial y contenido`;
    }
    switch (currentSection) {
      case 'dashboard':
        return 'Centro de operaciones y estado general del negocio';
      case 'clients':
        return 'Directorio de clientes y fichas de servicio';
      case 'projects':
        return 'Gestión de proyectos y etapas de desarrollo';
      case 'webs':
        return 'Administración de sitios web y repositorios';
      case 'domains':
        return 'Control de titularidad y vencimiento de dominios';
      case 'tasks':
        return 'Tareas operativas y recordatorios';
      case 'activity':
        return 'Historial auditado de eventos';
      case 'settings':
        return 'Integraciones y administración del sistema';
      default:
        return '';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden font-sans workbench-grid">
      {/* Desktop Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onNavigate={(sec) => handleNavigate(sec)}
        counts={{
          clients: clientsCount,
          projects: projectsCount,
          webs: websCount,
          domains: domainsCount,
          tasks: tasksCount,
        }}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <Header
          title={getSectionTitle()}
          subtitle={getSectionSubtitle()}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNewClient={() => setIsNewClientOpen(true)}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onOpenNewDomain={() => setIsNewDomainOpen(true)}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
          onToggleMobileMenu={() => setIsMobileNavOpen(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {currentSection === 'dashboard' && (
              <DashboardView
                onNavigate={handleNavigate}
                onOpenNewClient={() => setIsNewClientOpen(true)}
                onOpenNewProject={() => setIsNewProjectOpen(true)}
                onOpenNewDomain={() => setIsNewDomainOpen(true)}
                onOpenNewTask={() => setIsNewTaskOpen(true)}
              />
            )}

            {currentSection === 'clients' && (
              <>
                {selectedClientId ? (
                  <ClientDetailView
                    clientId={selectedClientId}
                    onBack={() => setSelectedClientId(null)}
                    onNavigateSection={handleNavigate}
                    onOpenOnboarding={(id) => setOnboardingClientId(id)}
                  />
                ) : (
                  <ClientListView
                    onSelectClient={(id) => setSelectedClientId(id)}
                    onOpenNewClient={() => setIsNewClientOpen(true)}
                  />
                )}
              </>
            )}

            {currentSection === 'projects' && (
              <ProjectListView
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setCurrentSection('clients');
                }}
                onOpenNewProject={() => setIsNewProjectOpen(true)}
              />
            )}

            {currentSection === 'webs' && (
              <WebListView
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setCurrentSection('clients');
                }}
                onOpenNewWeb={() => setIsNewWebOpen(true)}
              />
            )}

            {currentSection === 'domains' && (
              <DomainListView
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setCurrentSection('clients');
                }}
                onOpenNewDomain={() => setIsNewDomainOpen(true)}
              />
            )}

            {currentSection === 'tasks' && (
              <TaskListView
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setCurrentSection('clients');
                }}
                onOpenNewTask={() => setIsNewTaskOpen(true)}
              />
            )}

            {currentSection === 'activity' && (
              <ActivityListView
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setCurrentSection('clients');
                }}
              />
            )}

            {currentSection === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Cmd/Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentSection={currentSection}
        onNavigate={(sec) => handleNavigate(sec)}
      />

      {/* Global Action Modals */}
      <ClientFormModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onSaved={(c) => {
          setSelectedClientId(c.id);
          setCurrentSection('clients');
        }}
      />

      <ProjectFormModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />

      <DomainFormModal
        isOpen={isNewDomainOpen}
        onClose={() => setIsNewDomainOpen(false)}
      />

      <WebFormModal
        isOpen={isNewWebOpen}
        onClose={() => setIsNewWebOpen(false)}
      />

      <TaskFormModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />
    </div>
  );
}

export default App;
