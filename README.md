# TRAYECTORIA — Sistema Interno de Gestión

Centro de operaciones administrativo privado para gestionar clientes, proyectos, webs, dominios (.com.ar / .ar / .com), contenido editorial, checklists, tareas e historial operativo.

---

## 🚀 Inicio Rápido

### 1. Iniciar en Modo Desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:5173`.

### 2. Compilar para Producción
```bash
npm run build
```

---

## 🏗️ Arquitectura del Sistema

```
trayectoria-interno/
├── src/
│   ├── types/                  # Modelos TypeScript normalizados (Client, Project, Web, Domain, Task...)
│   ├── services/
│   │   ├── db/                 # Capa de base de datos local & repositorios
│   │   │   ├── repository.ts   # CRUD, búsqueda global y cálculos de vencimiento
│   │   │   ├── idGenerator.ts  # Generador de IDs estandarizados (TRAY-00001, etc.)
│   │   │   ├── storage.ts      # Persistencia reactiva con exportación e importación JSON
│   │   │   └── seedData.ts     # 3 clientes demo realistas (Arquitecto, Diseñadora, Abogado)
│   │   ├── supabase/           # Conector y adaptador para Supabase
│   │   │   └── client.ts
│   │   └── integrations/       # Especificación de integraciones externas
│   │       ├── status.ts       # Estado de GitHub, Cloudflare, NIC Argentina, Email
│   │       └── types.ts
│   ├── components/
│   │   ├── layout/             # Sidebar, Header con búsqueda global (Cmd/Ctrl+K), MobileNav
│   │   ├── dashboard/          # Métricas KPI, semáforo de dominios y actividad reciente
│   │   ├── clients/            # Directorio y Ficha individual completa (9 pestañas operativas)
│   │   ├── projects/           # Pipeline de proyectos (Kanban + Tabla)
│   │   ├── webs/               # Gestión de sitios, repos y Cloudflare Pages
│   │   ├── domains/            # Control de vencimientos y titularidad en NIC Argentina
│   │   ├── tasks/              # Tareas operativas y recordatorios
│   │   ├── activity/           # Historial cronológico y auditoría
│   │   ├── settings/           # Configuración, guías de conexión y respaldo JSON
│   │   └── auth/               # Pantalla de acceso / Supabase Auth gate
│   ├── App.tsx
│   └── main.tsx
└── supabase/
    └── schema.sql              # Script SQL completo de PostgreSQL/Supabase con RLS
```

---

## 🔌 Conexión de Supabase (Paso a Paso)

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ejecutar el script `supabase/schema.sql` en el **SQL Editor** de Supabase.
3. Crear un archivo `.env.local` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
```
4. Iniciar la aplicación. La capa de datos se conectará directamente a PostgreSQL.

---

## 🔒 Seguridad
- **Cero credenciales en texto plano**: Sólo se almacenan identificadores técnicos, nombres de repositorios y proyectos.
- **Titularidad de dominios**: Diferenciación explícita entre el titular legal (cliente) y la administración técnica (TRAYECTORIA).
