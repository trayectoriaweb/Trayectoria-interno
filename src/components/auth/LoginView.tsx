import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface LoginViewProps {
  onLoginSuccess: (user: { email: string; role: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('operaciones@trayectoria.com.ar');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        email: email || 'operaciones@trayectoria.com.ar',
        role: 'Administrador Operaciones',
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAFAFA]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200/90 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
            T
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
            TRAYECTORIA
          </h1>
          <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
            Sistema Interno de Gestión & Operaciones
          </p>
        </div>

        {/* Demo Notification Notice */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Acceso Administrativo Privado</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-normal">
            Autenticación preparada para <strong className="text-zinc-700">Supabase Auth</strong>. Podés ingresar directamente con el usuario demo de operaciones.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email de Operaciones"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full"
            disabled={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? 'Iniciando sesión...' : 'Ingresar al Panel'}
          </Button>
        </form>

        <div className="pt-4 border-t border-zinc-100 text-center text-[11px] text-zinc-400 font-mono">
          TRAYECTORIA © 2026 • Panel Confidencial
        </div>
      </div>
    </div>
  );
};
