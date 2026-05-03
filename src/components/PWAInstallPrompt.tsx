import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
      <div
        className="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg"
        style={{ backgroundColor: '#0F1738', color: '#F2EBDA', border: '1px solid #B8253A' }}
      >
        <Download size={20} style={{ color: '#B8253A', flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Instalar la app</p>
          <p className="text-xs opacity-70 leading-tight mt-0.5">Accede rápido desde tu móvil</p>
        </div>
        <button
          onClick={handleInstall}
          className="text-xs font-semibold px-3 py-1.5 rounded"
          style={{ backgroundColor: '#B8253A', color: '#F2EBDA' }}
        >
          Instalar
        </button>
        <button onClick={handleDismiss} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
