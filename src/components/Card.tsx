import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  /** Rotación sutil en grados. Por defecto 0 (sin rotación). Valores recomendados: -1 a 1. */
  tilt?: number;
  /** Si true, sombra carmín en vez de ink */
  carminShadow?: boolean;
  className?: string;
}

/**
 * Card base del sistema. Bordes negros gruesos + sombra sólida + rotación opcional.
 */
export default function Card({ children, tilt = 0, carminShadow = false, className = '' }: CardProps) {
  const shadow = carminShadow ? 'shadow-brut-carmin' : 'shadow-brut';
  const rotation = tilt !== 0 ? { transform: `rotate(${tilt}deg)` } : undefined;

  return (
    <div
      className={`bg-paper-2 border-2 border-ink ${shadow} ${className}`}
      style={rotation}
    >
      {children}
    </div>
  );
}
