-- ==============================================================================
-- TRAYECTORIA — ESQUEMA DE BASE DE DATOS SUPABASE (PostgreSQL)
-- ==============================================================================
-- Ejecutar todo este script en el "SQL Editor" de tu proyecto Supabase.
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: CLIENTES
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(30) PRIMARY KEY, -- Formato: TRAY-00001
  full_name VARCHAR(255) NOT NULL,
  commercial_name VARCHAR(255) DEFAULT '',
  profession VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT '',
  whatsapp VARCHAR(100) DEFAULT '',
  instagram VARCHAR(100) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  country VARCHAR(100) DEFAULT 'Argentina',
  photo_url TEXT DEFAULT '',
  status VARCHAR(50) NOT NULL DEFAULT 'Prospecto',
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  last_contact DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Información profesional
  specialties TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  experience_summary TEXT DEFAULT '',
  education_summary TEXT DEFAULT '',
  location_details TEXT DEFAULT '',
  working_hours TEXT DEFAULT '',

  -- Información comercial
  contracted_product VARCHAR(255) DEFAULT '',
  price VARCHAR(100) DEFAULT '',
  payment_method VARCHAR(100) DEFAULT '',
  contract_date DATE DEFAULT CURRENT_DATE,
  payment_status VARCHAR(50) DEFAULT 'Pendiente',
  renewal_date DATE,
  commercial_notes TEXT DEFAULT '',

  -- Metadatos técnicos (no sensibles)
  primary_domain VARCHAR(255) DEFAULT '',
  domain_registrar VARCHAR(100) DEFAULT 'NIC Argentina',
  domain_expiration DATE,
  dns_nameservers TEXT[] DEFAULT '{}',
  nic_delegation_status VARCHAR(100) DEFAULT 'Pendiente de Delegación en NIC',
  nic_auth_code VARCHAR(100) DEFAULT '',
  cloudflare_project VARCHAR(255) DEFAULT '',
  cloudflare_zone_id VARCHAR(255) DEFAULT '',
  production_url TEXT DEFAULT '',
  temp_preview_url TEXT DEFAULT '',
  github_repo_name VARCHAR(255) DEFAULT '',
  github_repo_url TEXT DEFAULT '',
  framework VARCHAR(100) DEFAULT 'Astro + Tailwind CSS',
  deployment_status VARCHAR(100) DEFAULT 'No inicializado',

  -- JSON estructurado de contenido web
  content JSONB DEFAULT '{}'::jsonb,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA: PROYECTOS
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(40) PRIMARY KEY, -- Formato: TRAY-00001-P01
  client_id VARCHAR(30) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  project_type VARCHAR(150) NOT NULL DEFAULT 'Sitio Web Completo',
  status VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  estimated_delivery_date DATE,
  real_delivery_date DATE,
  price VARCHAR(100) DEFAULT '',
  responsible VARCHAR(150) DEFAULT 'Operaciones Trayectoria',
  notes TEXT DEFAULT '',
  checklist JSONB DEFAULT '[]'::jsonb,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA: WEBS
CREATE TABLE IF NOT EXISTS webs (
  id VARCHAR(40) PRIMARY KEY, -- Formato: TRAY-00001-W01
  client_id VARCHAR(30) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  project_id VARCHAR(40) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  site_name VARCHAR(255) NOT NULL,
  primary_domain VARCHAR(255) NOT NULL,
  secondary_domains TEXT[] DEFAULT '{}',
  production_url TEXT DEFAULT '',
  preview_url TEXT DEFAULT '',
  github_repo_name VARCHAR(255) DEFAULT '',
  github_repo_url TEXT DEFAULT '',
  cloudflare_project VARCHAR(255) DEFAULT '',
  status VARCHAR(50) NOT NULL DEFAULT 'Desarrollo',
  published_at DATE,
  last_updated_at DATE DEFAULT CURRENT_DATE,
  framework VARCHAR(100) DEFAULT 'Astro + Tailwind CSS',
  technical_notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABLA: DOMINIOS
CREATE TABLE IF NOT EXISTS domains (
  id VARCHAR(40) PRIMARY KEY, -- Formato: TRAY-00001-D01
  domain_name VARCHAR(255) NOT NULL,
  client_id VARCHAR(30) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  domain_type VARCHAR(50) NOT NULL DEFAULT '.com.ar',
  registrar VARCHAR(100) NOT NULL DEFAULT 'NIC Argentina',
  owner VARCHAR(255) NOT NULL, -- Titular (Cliente)
  managed_by VARCHAR(255) NOT NULL DEFAULT 'TRAYECTORIA (Administración técnica)',
  dns_nameservers TEXT[] DEFAULT '{}',
  nic_delegation_status VARCHAR(100) DEFAULT 'Pendiente de Delegación en NIC',
  registered_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Activo',
  notes TEXT DEFAULT '',
  auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA: TAREAS
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(40) PRIMARY KEY, -- Formato: TASK-001
  client_id VARCHAR(30) REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255),
  project_id VARCHAR(40) REFERENCES projects(id) ON DELETE SET NULL,
  projectName VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  priority VARCHAR(50) NOT NULL DEFAULT 'Media',
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at DATE,
  assigned_to VARCHAR(150) NOT NULL DEFAULT 'Operaciones Trayectoria',
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 7. TABLA: ACTIVIDAD / HISTORIAL
CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(40) PRIMARY KEY,
  client_id VARCHAR(30) REFERENCES clients(id) ON DELETE CASCADE,
  client_name VARCHAR(255),
  project_id VARCHAR(40) REFERENCES projects(id) ON DELETE SET NULL,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  author VARCHAR(100) NOT NULL DEFAULT 'Operaciones',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABLA: NOTAS INTERNAS (Privadas)
CREATE TABLE IF NOT EXISTS internal_notes (
  id VARCHAR(40) PRIMARY KEY,
  client_id VARCHAR(30) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  author VARCHAR(150) NOT NULL DEFAULT 'Operaciones Trayectoria',
  content TEXT NOT NULL,
  created_at VARCHAR(100) NOT NULL
);

-- 9. ÍNDICES DE BÚSQUEDA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_domain ON clients(primary_domain);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_webs_client_id ON webs(client_id);
CREATE INDEX IF NOT EXISTS idx_domains_expiration ON domains(expiration_date);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_activity_client_id ON activity_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_notes_client_id ON internal_notes(client_id);

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE webs ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_notes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para panel interno (Anon & Authenticated)
CREATE POLICY "Permitir acceso completo a clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo a projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo a webs" ON webs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo a domains" ON domains FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo a tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo a activity_logs" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo a internal_notes" ON internal_notes FOR ALL USING (true) WITH CHECK (true);
