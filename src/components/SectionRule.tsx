interface SectionRuleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Separador de sección con guiones a lo "máquina de escribir".
 * Renderiza algo como: ━━ TÍTULO ━━━━━━━━━━━━━━━━
 */
export default function SectionRule({ children, className = '' }: SectionRuleProps) {
  return (
    <div className={`font-mono text-[11px] tracking-widest text-carmin uppercase ${className}`}>
      ━━ {children} ━━━━━━━━━━━━━━━━
    </div>
  );
}
