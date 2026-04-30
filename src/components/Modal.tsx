import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
  maxAncho?: 'sm' | 'md' | 'lg';
}

const ANCHOS = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

export default function Modal({ abierto, onCerrar, titulo, children, maxAncho = 'md' }: ModalProps) {
  useEffect(() => {
    if (!abierto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 bg-ink/70 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-paper border-2 border-ink shadow-brut-lg w-full ${ANCHOS[maxAncho]} my-4`}
      >
        <div className="bg-ink text-paper px-4 py-3 flex justify-between items-center">
          <h2 className="font-mono text-[11px] tracking-widest uppercase">{titulo}</h2>
          <button onClick={onCerrar} aria-label="Cerrar" className="hover:text-carmin">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
