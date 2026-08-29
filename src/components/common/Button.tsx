import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none gap-2 select-none';

  const variantClasses = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm active:bg-zinc-950',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300',
    outline: 'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100',
    ghost: 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
  }[variant];

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 h-8',
    md: 'text-sm px-3.5 py-2 h-9',
    lg: 'text-sm px-4 py-2.5 h-10',
  }[size];

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} disabled={disabled} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
