import type { ReactNode } from 'react';

type TagVariant = 'ink' | 'carmin' | 'paper';

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  className?: string;
}

/**
 * Etiqueta neo-brutalista con tres variantes de fondo.
 * Se usa para metadatos (fechas, estados, niveles) en toda la web.
 */
export default function Tag({ children, variant = 'paper', className = '' }: TagProps) {
  const variants: Record<TagVariant, string> = {
    ink: 'bg-ink text-paper border-ink',
    carmin: 'bg-carmin text-paper border-ink',
    paper: 'bg-paper-2 text-ink border-ink',
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 text-[11px] tracking-widest border-[1.5px] font-semibold uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
