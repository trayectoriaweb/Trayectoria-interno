import React, { useState } from 'react';
import {
  Settings,
  Database,
  GitBranch,
  Server,
  Network,
  Mail,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Code2,
  Copy,
  Check,
  Shield,
  FileCode,
} from 'lucide-react';
import { INTEGRATIONS_CATALOG } from '../../services/integrations/status';
import { getSupabaseConfig, SUPABASE_SETUP_GUIDE } from '../../services/supabase/client';
import { exportDatabaseJson, importDatabaseJson, resetDatabase, clearDatabase } from '../../services/db/storage';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const SettingsView: React.FC = () => {
  const supabaseConfig = getSupabaseConfig();
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVar(key);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trayectoria_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedbackMessage('Respaldo JSON descargado con éxito.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJson(content);
      if (success) {
        setFeedbackMessage('Base de datos importada y restaurada exitosamente.');
      } else {
        alert('El archivo no tiene el formato JSON válido de TRAYECTORIA.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    resetDatabase();
    setIsResetConfirmOpen(false);
    setFeedbackMessage('Datos restablecidos a los 3 clientes de demostración iniciales.');
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-150 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
          Configuración & Integraciones del Sistema
        </h2>
        <p className="text-xs text-zinc-500">
          Estado de conexiones externas, variables de entorno, esquema de base de datos y copias de seguridad.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            &times;
          </button>
        </div>
      )}

      {/* 1. Integrations Catalog */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-zinc-700" />
          1. Estado de Conectores & APIs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATIONS_CATALOG.map((integration) => {
            return (
              <div
                key={integration.id}
                className="p-5 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{integration.name}</h4>
                      <p className="text-[11px] text-zinc-400">{integration.category}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        integration.configured
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {integration.statusText}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{integration.description}</p>

                  <div className="mt-3 pt-3 border-t border-zinc-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Variables de Entorno Requeridas:
                    </span>
                    {integration.requiredCredentials.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-zinc-800">{c.envVar}</span>
                        <span className="text-[10px] text-zinc-400">{c.isSecret ? 'Secreto' : 'Público'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Automatizaciones Planificadas:
                  </span>
                  <ul className="text-[11px] text-zinc-500 space-y-0.5 list-disc list-inside">
                    {integration.plannedAutomations.slice(0, 2).map((a, idx) => (
                      <li key={idx} className="truncate">{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Supabase Connection Details & Guide */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              2. Conexión de Supabase (Backend & Base de Datos)
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Instrucciones exactas para enlazar tu proyecto Supabase real cuando tengas las credenciales.
            </p>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              supabaseConfig.isConnected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            {supabaseConfig.isConnected ? 'Conectado a Supabase' : 'Modo Demo (Persistencia Local Activa)'}
          </span>
        </div>

        <div className="space-y-4 text-xs text-zinc-700">
          <p>
            TRAYECTORIA está estructurada para trabajar en modo desacoplado. Para conectar tu base de datos Supabase:
          </p>

          <ol className="list-decimal list-inside space-y-2 pl-1">
            <li>
              Crea un proyecto en <span className="font-semibold text-zinc-900">supabase.com</span>.
            </li>
            <li>
              Abre el <span className="font-semibold text-zinc-900">SQL Editor</span> de Supabase y ejecuta el archivo{' '}
              <span className="font-mono font-semibold text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">
                supabase/schema.sql
              </span>{' '}
              incluido en este proyecto.
            </li>
            <li>
              Crea un archivo <span className="font-mono font-semibold text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">.env.local</span> en la raíz del proyecto con las siguientes variables:
            </li>
          </ol>

          {/* Code snippet block */}
          <div className="relative rounded-lg bg-zinc-900 p-4 text-zinc-100 font-mono text-xs overflow-x-auto">
            <div className="absolute right-3 top-3">
              <button
                onClick={() =>
                  handleCopy(
                    `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key`,
                    'env'
                  )
                }
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Copiar plantilla"
              >
                {copiedVar === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre>
              <code>{`# .env.local
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code>
            </pre>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-600 flex items-start gap-2">
            <Shield className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
            <span>
              <strong className="text-zinc-900">Seguridad:</strong> El esquema SQL ya incluye todas las políticas RLS
              (Row Level Security) y constraints referenciales. Ninguna credencial sensible ni token de GitHub se almacena
              en texto plano.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Database Backup, Export & Reset */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="border-b border-zinc-100 pb-4">
          <h3 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2">
            <Download className="w-4 h-4 text-zinc-700" />
            3. Respaldo, Exportación & Datos Demo
          </h3>
          <p className="text-xs text-zinc-500">
            Descargá un backup completo en formato JSON o restablecé el estado inicial del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Exportar Respaldo</h4>
              <p className="text-xs text-zinc-500 mt-1">Descargá todos los clientes, webs, dominios y notas.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              icon={<Download className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Exportar JSON
            </Button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Restaurar Respaldo</h4>
              <p className="text-xs text-zinc-500 mt-1">Cargá un archivo JSON para restaurar los datos.</p>
            </div>
            <label className="inline-flex items-center justify-center font-medium rounded-lg transition-colors border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 text-xs px-3.5 py-2 h-9 cursor-pointer gap-2 select-none w-full">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          {/* Clean / Empty Database */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Limpiar Todo</h4>
              <p className="text-xs text-zinc-500 mt-1">Borra los 3 clientes de prueba para empezar de cero.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClearConfirmOpen(true)}
              className="w-full text-rose-600 hover:bg-rose-50 hover:border-rose-200"
            >
              Vaciar Datos Demo
            </Button>
          </div>

          {/* Reset Demo */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Recargar Demo</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Recarga los 3 clientes de demostración (Arquitecto, Diseñadora, Abogado).
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Restablecer Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="¿Restablecer datos de demostración?"
        subtitle="Esta acción recargará las fichas de los 3 clientes demo originales."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-zinc-600">
            Se recargarán las fichas de Juan Pérez, María González y Carlos Rodríguez.
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
            <Button variant="ghost" onClick={() => setIsResetConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleResetData}>
              Sí, Restablecer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Database Modal */}
      <Modal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        title="¿Vaciar todos los datos de prueba?"
        subtitle="Esta acción dejará el sistema 100% limpio y vacío (0 clientes, 0 webs, 0 dominios) para que cargues tus clientes reales de TRAYECTORIA."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-zinc-600">
            Se borrarán los 3 clientes de prueba (Juan Pérez, María González, Carlos Rodríguez) para que comiences desde cero.
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
            <Button variant="ghost" onClick={() => setIsClearConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearDatabase();
                setIsClearConfirmOpen(false);
                setFeedbackMessage('Base de datos vaciada. El sistema está 100% limpio para tus clientes reales.');
              }}
            >
              Sí, Vaciar Base de Datos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
