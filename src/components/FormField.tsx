import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  helper?: string;
  requerido?: boolean;
}

export default function FormField({ label, children, error, helper, requerido }: FormFieldProps) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">
        {label}
        {requerido && <span className="text-carmin ml-1">*</span>}
      </span>
      {children}
      {error && <span className="block text-carmin text-xs mt-1 font-semibold">{error}</span>}
      {!error && helper && <span className="block text-ink/50 text-xs mt-1 italic">{helper}</span>}
    </label>
  );
}
