import { useState, useRef, type ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  /** URL actual de la imagen (si existe) */
  valor: string | null;
  /** Callback con la nueva URL pública o null si se elimina */
  onCambio: (url: string | null) => void;
  /** Carpeta dentro del bucket (ej: 'obras', 'profiles', 'galeria') */
  carpeta: string;
  /** Aspecto del preview */
  aspecto?: 'cuadrado' | 'retrato' | 'paisaje';
  label?: string;
}

const ASPECTOS = {
  cuadrado: 'aspect-square',
  retrato: 'aspect-[3/4]',
  paisaje: 'aspect-[4/3]',
};

export default function ImageUpload({
  valor,
  onCambio,
  carpeta,
  aspecto = 'retrato',
  label = 'Subir imagen',
}: ImageUploadProps) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Solo se admiten imágenes');
      return;
    }

    setSubiendo(true);

    // Refresh the session before uploading to avoid expired JWT errors
    const { error: errSesion } = await supabase.auth.refreshSession();
    if (errSesion) {
      setError('Tu sesión expiró. Por favor, vuelve a iniciar sesión.');
      setSubiendo(false);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const nombreLimpio = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: errSubida } = await supabase.storage
      .from('fotos')
      .upload(nombreLimpio, file, { cacheControl: '3600', upsert: false });

    if (errSubida) {
      setError(`Error al subir: ${errSubida.message}`);
      setSubiendo(false);
      return;
    }

    const { data } = supabase.storage.from('fotos').getPublicUrl(nombreLimpio);
    onCambio(data.publicUrl);
    setSubiendo(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleQuitar() {
    onCambio(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      {valor ? (
        <div className="flex gap-3 items-start">
          <div
            className={`${ASPECTOS[aspecto]} w-32 bg-ink border-2 border-ink overflow-hidden flex-shrink-0`}
          >
            <img src={valor} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-paper-2 text-ink border-[1.5px] border-ink px-3 py-1.5 text-[11px] tracking-widest font-semibold uppercase hover:shadow-brut-sm transition-shadow"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleQuitar}
              className="text-carmin text-[11px] tracking-widest font-semibold uppercase flex items-center gap-1 hover:underline"
            >
              <X size={12} /> Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className={`${ASPECTOS[aspecto]} w-32 border-[1.5px] border-dashed border-ink flex flex-col items-center justify-center gap-2 text-ink/60 hover:text-ink hover:bg-paper-2 transition-colors disabled:opacity-50`}
        >
          <Upload size={20} />
          <span className="text-[10px] tracking-widest uppercase">{subiendo ? 'Subiendo…' : label}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-carmin text-xs mt-2 font-semibold">{error}</p>}
    </div>
  );
}
