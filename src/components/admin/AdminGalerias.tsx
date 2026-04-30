import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Youtube as YoutubeIcon } from 'lucide-react';
import Modal from '../Modal';
import FormField from '../FormField';
import ImageUpload from '../ImageUpload';
import SectionRule from '../SectionRule';
import { supabase } from '../../lib/supabase';
import type { Obra, ObraFoto, ObraVideo } from '../../types/database';

/**
 * Extrae el ID de YouTube de varios formatos de URL:
 * - youtube.com/watch?v=XXX
 * - youtu.be/XXX
 * - youtube.com/embed/XXX
 * - youtube.com/shorts/XXX
 * Si solo se pasa el ID, lo devuelve tal cual.
 */
function extraerYoutubeId(input: string): string | null {
  const limpio = input.trim();
  if (!limpio) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(limpio)) return limpio; // ya es un ID
  const patrones = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patrones) {
    const m = limpio.match(re);
    if (m) return m[1];
  }
  return null;
}

export default function AdminGalerias() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSeleccionada, setObraSeleccionada] = useState<string>('');
  const [fotos, setFotos] = useState<ObraFoto[]>([]);
  const [videos, setVideos] = useState<ObraVideo[]>([]);
  const [cargando, setCargando] = useState(true);

  const [modalFoto, setModalFoto] = useState(false);
  const [modalVideo, setModalVideo] = useState(false);

  // Estado del formulario foto
  const [fotoNuevaUrl, setFotoNuevaUrl] = useState<string | null>(null);
  const [fotoPie, setFotoPie] = useState('');

  // Estado del formulario video
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitulo, setVideoTitulo] = useState('');
  const [errorVideo, setErrorVideo] = useState<string | null>(null);

  useEffect(() => {
    void cargarObras();
  }, []);

  useEffect(() => {
    if (obraSeleccionada) void cargarMedia(obraSeleccionada);
    else {
      setFotos([]);
      setVideos([]);
    }
  }, [obraSeleccionada]);

  async function cargarObras() {
    setCargando(true);
    const { data } = await supabase.from('obras').select('*').order('anio_estreno', { ascending: false });
    if (data) {
      setObras(data);
      if (data.length > 0 && !obraSeleccionada) setObraSeleccionada(data[0].id);
    }
    setCargando(false);
  }

  async function cargarMedia(obra_id: string) {
    const [fotosRes, videosRes] = await Promise.all([
      supabase.from('obra_fotos').select('*').eq('obra_id', obra_id).order('orden'),
      supabase.from('obra_videos').select('*').eq('obra_id', obra_id).order('orden'),
    ]);
    if (fotosRes.data) setFotos(fotosRes.data);
    if (videosRes.data) setVideos(videosRes.data);
  }

  // ─── FOTOS ────────────────────────────────────────────────
  function abrirModalFoto() {
    setFotoNuevaUrl(null);
    setFotoPie('');
    setModalFoto(true);
  }

  async function guardarFoto(e: FormEvent) {
    e.preventDefault();
    if (!fotoNuevaUrl || !obraSeleccionada) return;
    await supabase.from('obra_fotos').insert({
      obra_id: obraSeleccionada,
      url: fotoNuevaUrl,
      pie: fotoPie || null,
      orden: fotos.length,
      es_portada: false,
    });
    setModalFoto(false);
    await cargarMedia(obraSeleccionada);
  }

  async function eliminarFoto(id: string) {
    if (!confirm('¿Eliminar esta foto?')) return;
    await supabase.from('obra_fotos').delete().eq('id', id);
    await cargarMedia(obraSeleccionada);
  }

  // ─── VIDEOS ───────────────────────────────────────────────
  function abrirModalVideo() {
    setVideoUrl('');
    setVideoTitulo('');
    setErrorVideo(null);
    setModalVideo(true);
  }

  async function guardarVideo(e: FormEvent) {
    e.preventDefault();
    if (!obraSeleccionada) return;
    const youtube_id = extraerYoutubeId(videoUrl);
    if (!youtube_id) {
      setErrorVideo('No es una URL de YouTube válida o un ID de 11 caracteres.');
      return;
    }
    await supabase.from('obra_videos').insert({
      obra_id: obraSeleccionada,
      youtube_id,
      titulo: videoTitulo || null,
      orden: videos.length,
    });
    setModalVideo(false);
    await cargarMedia(obraSeleccionada);
  }

  async function eliminarVideo(id: string) {
    if (!confirm('¿Eliminar este video?')) return;
    await supabase.from('obra_videos').delete().eq('id', id);
    await cargarMedia(obraSeleccionada);
  }

  if (cargando) return <p className="text-ink/60 italic">Cargando obras…</p>;
  if (obras.length === 0)
    return (
      <p className="text-ink/60 italic">
        Crea primero una obra en la pestaña de Obras para gestionar su galería.
      </p>
    );

  return (
    <div className="space-y-8">
      <div>
        <SectionRule className="mb-3">Selecciona obra</SectionRule>
        <select
          value={obraSeleccionada}
          onChange={(e) => setObraSeleccionada(e.target.value)}
          className="input-brut max-w-md"
        >
          {obras.map((o) => (
            <option key={o.id} value={o.id}>
              {o.titulo} {o.anio_estreno ? `(${o.anio_estreno})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* FOTOS */}
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <SectionRule>Galería de fotos</SectionRule>
          <button
            onClick={abrirModalFoto}
            className="bg-ink text-paper px-4 py-2 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Subir foto
          </button>
        </div>

        {fotos.length === 0 ? (
          <p className="text-ink/60 italic">No hay fotos en esta obra.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {fotos.map((f) => (
              <div key={f.id} className="border-2 border-ink bg-paper-2 group relative">
                <div className="aspect-square bg-ink overflow-hidden">
                  <img src={f.url} alt={f.pie ?? ''} className="w-full h-full object-cover" />
                </div>
                {f.pie && (
                  <div className="px-2 py-1.5 text-xs italic text-ink/75 border-t border-ink/30">{f.pie}</div>
                )}
                <button
                  onClick={() => eliminarFoto(f.id)}
                  aria-label="Eliminar"
                  className="absolute top-2 right-2 bg-carmin text-paper p-1.5 border border-paper opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIDEOS */}
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <SectionRule>Videos de YouTube</SectionRule>
          <button
            onClick={abrirModalVideo}
            className="bg-ink text-paper px-4 py-2 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all flex items-center gap-2"
          >
            <YoutubeIcon size={14} /> Añadir video
          </button>
        </div>

        {videos.length === 0 ? (
          <p className="text-ink/60 italic">No hay videos en esta obra.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {videos.map((v) => (
              <div key={v.id} className="border-2 border-ink bg-paper-2 group relative">
                <div className="aspect-video bg-ink overflow-hidden">
                  <img
                    src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`}
                    alt={v.titulo ?? ''}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-3 py-2 border-t border-ink/30">
                  <div className="font-serif font-bold text-sm text-ink leading-tight">
                    {v.titulo ?? 'Sin título'}
                  </div>
                  <div className="font-mono text-[10px] text-ink/50">{v.youtube_id}</div>
                </div>
                <button
                  onClick={() => eliminarVideo(v.id)}
                  aria-label="Eliminar"
                  className="absolute top-2 right-2 bg-carmin text-paper p-1.5 border border-paper opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal añadir foto */}
      {modalFoto && (
        <Modal abierto onCerrar={() => setModalFoto(false)} titulo="Subir foto" maxAncho="sm">
          <form onSubmit={guardarFoto} className="space-y-4">
            <FormField label="Imagen" requerido>
              <ImageUpload
                valor={fotoNuevaUrl}
                onCambio={setFotoNuevaUrl}
                carpeta={`obras/${obraSeleccionada}/galeria`}
                aspecto="cuadrado"
                label="Subir"
              />
            </FormField>
            <FormField label="Pie de foto (opcional)">
              <input
                type="text"
                value={fotoPie}
                onChange={(e) => setFotoPie(e.target.value)}
                className="input-brut"
                placeholder="Función estreno, marzo 2024"
              />
            </FormField>

            <div className="flex justify-between items-center pt-3 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => setModalFoto(false)}
                className="text-ink/60 text-[11px] tracking-widest uppercase font-semibold hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!fotoNuevaUrl}
                className="bg-ink text-paper px-6 py-3 font-bold text-[12px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin disabled:opacity-50"
              >
                Añadir →
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal añadir video */}
      {modalVideo && (
        <Modal abierto onCerrar={() => setModalVideo(false)} titulo="Añadir video de YouTube" maxAncho="sm">
          <form onSubmit={guardarVideo} className="space-y-4">
            <FormField
              label="URL o ID de YouTube"
              helper="Acepta youtube.com/watch?v=…, youtu.be/…, /shorts/… o el ID de 11 caracteres."
              requerido
            >
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="input-brut font-mono text-xs"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </FormField>

            <FormField label="Título descriptivo">
              <input
                type="text"
                value={videoTitulo}
                onChange={(e) => setVideoTitulo(e.target.value)}
                className="input-brut"
                placeholder="Función completa, mayo 2024"
              />
            </FormField>

            {errorVideo && <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold">{errorVideo}</div>}

            <div className="flex justify-between items-center pt-3 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => setModalVideo(false)}
                className="text-ink/60 text-[11px] tracking-widest uppercase font-semibold hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-ink text-paper px-6 py-3 font-bold text-[12px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin"
              >
                Añadir →
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
