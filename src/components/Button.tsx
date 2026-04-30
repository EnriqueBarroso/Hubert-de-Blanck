import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'carmin';

interface BaseProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

interface ButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  to?: never;
  href?: never;
}

interface LinkProps extends BaseProps {
  to: string;
  href?: never;
}

interface AnchorProps extends BaseProps {
  href: string;
  to?: never;
  target?: string;
  rel?: string;
}

type Props = ButtonProps | LinkProps | AnchorProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-paper border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A]',
  secondary:
    'bg-paper-2 text-ink border-[1.5px] border-ink hover:shadow-brut-sm',
  carmin:
    'bg-carmin text-paper border-2 border-ink shadow-brut hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#0F1738]',
};

export default function Button(props: Props) {
  const { variant = 'primary', children, className = '' } = props;
  const base =
    'inline-block px-6 py-3 font-bold text-[12px] tracking-widest uppercase no-underline transition-all';
  const combined = `${base} ${variantClasses[variant]} ${className}`;

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={combined}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    return (
      <a href={props.href} target={props.target} rel={props.rel} className={combined}>
        {children}
      </a>
    );
  }

  const { variant: _v, children: _c, className: _cl, ...buttonProps } = props as ButtonProps;
  return (
    <button className={combined} {...buttonProps}>
      {children}
    </button>
  );
}
