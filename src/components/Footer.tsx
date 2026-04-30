import { COMPANIA } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper px-6 py-4 flex justify-between items-center font-mono text-[10px] tracking-widest uppercase">
      <span>★ ★ ★</span>
      <span className="hidden sm:inline">{COMPANIA.ciudad} · {COMPANIA.pais}</span>
      <span className="text-carmin">IG · YT · FB</span>
    </footer>
  );
}
