import { COMPANIA } from '../lib/constants';

const REDES = [
  { label: 'IG', href: 'https://www.instagram.com/huber_teatro.oficial/' },
  { label: 'YT', href: 'https://www.youtube.com/@hubertdeblanckcompaniateat7988' },
  { label: 'FB', href: 'https://www.facebook.com/hubert.deblanck' },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper px-6 py-4 flex justify-between items-center font-mono text-[10px] tracking-widest uppercase">
      <span>★ ★ ★</span>
      <span className="hidden sm:inline">{COMPANIA.ciudad} · {COMPANIA.pais}</span>
      <span className="flex gap-3">
        {REDES.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-carmin hover:text-paper transition-colors"
          >
            {label}
          </a>
        ))}
      </span>
    </footer>
  );
}
