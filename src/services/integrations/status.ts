import { IntegrationStatus } from './types';

export const INTEGRATIONS_CATALOG: IntegrationStatus[] = [
  {
    id: 'supabase',
    name: 'Supabase Database & Auth',
    category: 'Backend / Base de Datos',
    configured: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    statusText: import.meta.env.VITE_SUPABASE_URL ? 'Conectado' : 'Listo para conectar (Modo Demo Activo)',
    description: 'Motor de base de datos PostgreSQL, autenticación de administradores de TRAYECTORIA y sincronización en tiempo real.',
    requiredCredentials: [
      {
        name: 'Supabase Project URL',
        envVar: 'VITE_SUPABASE_URL',
        purpose: 'Endpoint API REST y WebSocket de tu proyecto Supabase.',
        isSecret: false,
      },
      {
        name: 'Supabase Anon Key',
        envVar: 'VITE_SUPABASE_ANON_KEY',
        purpose: 'Clave pública para operaciones con Row Level Security (RLS).',
        isSecret: true,
      },
    ],
    plannedAutomations: [
      'Persistencia en la nube de clientes, proyectos, webs, tareas y notas.',
      'Autenticación segura con Supabase Auth (Magic link / Password).',
      'Copias de seguridad automáticas de todas las fichas técnicas.',
    ],
  },
  {
    id: 'github',
    name: 'GitHub API',
    category: 'Control de Versiones & Código',
    configured: false,
    statusText: 'Arquitectura preparada (Sin credenciales cargadas)',
    description: 'Conexión con la organización u usuario de GitHub de TRAYECTORIA para gestionar repositorios de clientes.',
    requiredCredentials: [
      {
        name: 'GitHub Personal Access Token (Fine-grained)',
        envVar: 'GITHUB_ACCESS_TOKEN',
        purpose: 'Creación automática de repositorios a partir de templates (Astro/Next.js).',
        isSecret: true,
      },
      {
        name: 'GitHub Organization / Owner',
        envVar: 'GITHUB_ORG',
        purpose: 'Nombre de la organización de GitHub donde residirán los repos de clientes.',
        isSecret: false,
      },
    ],
    plannedAutomations: [
      'Crear repo privado para nuevo cliente a partir de template base.',
      'Sincronizar commits recientes y estado de branches.',
      'Disparar webhooks de actualización de contenido.',
    ],
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages & DNS API',
    category: 'Hosting, DNS & SSL',
    configured: false,
    statusText: 'Arquitectura preparada (Sin credenciales cargadas)',
    description: 'Administración de proyectos en Cloudflare Pages, gestión de registros DNS, SSL/TLS y dominios.',
    requiredCredentials: [
      {
        name: 'Cloudflare API Token',
        envVar: 'CLOUDFLARE_API_TOKEN',
        purpose: 'Permisos de lectura/escritura para Cloudflare Pages y DNS Zones.',
        isSecret: true,
      },
      {
        name: 'Cloudflare Account ID',
        envVar: 'CLOUDFLARE_ACCOUNT_ID',
        purpose: 'Identificador único de la cuenta de Cloudflare.',
        isSecret: false,
      },
    ],
    plannedAutomations: [
      'Creación automática de proyecto en Cloudflare Pages vinculado al repo.',
      'Asignación y verificación instantánea de dominios custom y subdominios preview.',
      'Monitoreo automático de estado de deployments en producción.',
    ],
  },
  {
    id: 'nic_ar',
    name: 'NIC Argentina / Dominios .ar',
    category: 'Registro de Dominios Nacionales',
    configured: false,
    statusText: 'Monitoreo interno preparado (Gestión de titularidad)',
    description: 'Seguimiento de titularidad y vencimiento de dominios .com.ar y .ar registrados bajo el CUIT de cada cliente.',
    requiredCredentials: [
      {
        name: 'Módulo de Verificación WHOIS / API (si disponible)',
        envVar: 'NIC_AR_TRACKING_MODE',
        purpose: 'Consulta periódica de estado de delegación y fecha de vencimiento.',
        isSecret: false,
      },
    ],
    plannedAutomations: [
      'Cálculo automático de días restantes hasta el vencimiento.',
      'Alertas de 60, 30 y 15 días previos al vencimiento del dominio del cliente.',
      'Generación de instructivo de renovación personalizado para el cliente.',
    ],
  },
  {
    id: 'email',
    name: 'Servicio de Email (Resend / SMTP)',
    category: 'Comunicaciones & Recordatorios',
    configured: false,
    statusText: 'Arquitectura preparada (Sin credenciales cargadas)',
    description: 'Envío de emails transaccionales, recordatorios de vencimiento de dominios y avisos de entrega.',
    requiredCredentials: [
      {
        name: 'Resend API Key (o SMTP Host/User/Pass)',
        envVar: 'RESEND_API_KEY',
        purpose: 'Envío de notificaciones automáticas y alertas por correo.',
        isSecret: true,
      },
      {
        name: 'Sender Email Address',
        envVar: 'EMAIL_FROM',
        purpose: 'Dirección remitente corporativa (ej. operaciones@trayectoria.com.ar).',
        isSecret: false,
      },
    ],
    plannedAutomations: [
      'Recordatorio automático al cliente 30 días antes del vencimiento de su dominio.',
      'Aviso de nuevo entregable o versión de preview lista para revisión.',
      'Notificaciones internas de tareas asignadas o vencidas.',
    ],
  },
];
