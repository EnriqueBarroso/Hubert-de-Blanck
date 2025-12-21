import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, Link as LinkIcon, Loader2, Plus, Pencil, Save, Image as ImageIcon } from "lucide-react";
import { GalleryItem, Play } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definimos un tipo local para evitar conflictos de TypeScript mientras tanto
type SafeGalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  category?: string | null;
  play_id?: string | null;
  play?: { title: string } | null;
};

const AdminGalleryManager = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<SafeGalleryItem[]>([]);
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Estado para edición
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // 🟢 AHORA USAMOS TEXTO, NO FILE
  const [category, setCategory] = useState("Funciones"); // Por defecto
  const [selectedPlayId, setSelectedPlayId] = useState<string>("none");

  // Categorías fijas (puedes añadir más)
  const categories = ["Funciones", "Ensayos", "Equipo", "Historia", "Espacios"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Cargar Imágenes
      const { data: galleryData, error: galleryError } = await supabase
        .from("gallery")
        .select(`*, play:plays(title)`)
        .order("created_at", { ascending: false });

      if (galleryError) throw galleryError;
      
      // Mapeo seguro para evitar errores de tipos
      const safeImages = (galleryData || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        category: item.category,
        play_id: item.play_id,
        play: item.play
      }));
      
      setImages(safeImages);

      // 2. Cargar Obras para el select
      const { data: playsData, error: playsError } = await supabase
        .from("plays")
        .select("*")
        .order("title");
      
      if (playsError) throw playsError;
      setPlays(playsData || []);

    } catch (error: any) {
      console.error("Error cargando datos:", error);
      toast({ variant: "destructive", title: "Error de carga", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: SafeGalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setImageUrl(item.image_url || ""); // Cargamos la URL existente
    setCategory(item.category || "Funciones");
    setSelectedPlayId(item.play_id || "none");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !imageUrl) {
      toast({ variant: "destructive", title: "Faltan datos", description: "El título y la URL de la imagen son obligatorios." });
      return;
    }

    setSubmitting(true);
    try {
      // Preparamos los datos
      const itemData = {
        title,
        description,
        image_url: imageUrl, // Guardamos la URL directa de R2
        category,
        play_id: selectedPlayId === "none" ? null : selectedPlayId,
      };

      if (editingId) {
        // --- MODO ACTUALIZAR ---
        const { error } = await supabase
          .from("gallery")
          .update(itemData)
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Actualizado", description: "Imagen actualizada correctamente" });

      } else {
        // --- MODO CREAR ---
        const { error } = await supabase
          .from("gallery")
          .insert(itemData);

        if (error) throw error;
        toast({ title: "Creado", description: "Nueva imagen registrada" });
      }

      setDialogOpen(false);
      resetForm();
      fetchData(); // Recargamos la lista

    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este registro? (La imagen seguirá en R2, solo se borra de la web)")) return;

    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Eliminado", description: "Registro eliminado correctamente" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setCategory("Funciones");
    setSelectedPlayId("none");
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h3 className="text-xl font-medium">Gestor de Galería (Modo R2)</h3>
            <p className="text-sm text-muted-foreground">Gestiona los enlaces a tus imágenes en Cloudflare R2</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Imagen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Registro" : "Registrar Nueva Imagen"}</DialogTitle>
              <DialogDescription>
                Sube tu imagen a Cloudflare R2 primero, copia la URL pública y pégala aquí.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              
              {/* Título */}
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Ensayo General" required />
              </div>

              {/* URL de R2 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> URL de la Imagen (R2) *
                </Label>
                <Input 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    placeholder="https://pub-xxxx.r2.dev/mi-foto.jpg" 
                    required 
                />
                <p className="text-[10px] text-muted-foreground">
                    Copia el "Public URL" desde tu panel de Cloudflare.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Categoría */}
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Obra Relacionada */}
                <div className="space-y-2">
                  <Label>Obra (Opcional)</Label>
                  <Select value={selectedPlayId} onValueChange={setSelectedPlayId}>
                    <SelectTrigger><SelectValue placeholder="Vincular a obra..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Sin vincular --</SelectItem>
                      {plays.map(play => (
                        <SelectItem key={play.id} value={play.id}>{play.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label>Descripción (Opcional)</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles extra..." />
              </div>

              {/* Vista previa pequeña */}
              {imageUrl && (
                  <div className="rounded-md border p-2 bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground mb-2">Vista previa:</p>
                      <img src={imageUrl} alt="Preview" className="h-20 mx-auto object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {submitting ? "Guardando..." : editingId ? "Guardar Cambios" : "Registrar Imagen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group relative border-muted">
              <div className="aspect-square relative">
                <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center cursor-default gap-2">
                  <p className="font-bold text-sm line-clamp-1">{img.title}</p>
                  
                  <div className="flex flex-wrap justify-center gap-1">
                    {img.category && (
                        <span className="text-[10px] bg-white/20 px-1.5 rounded">{img.category}</span>
                    )}
                    {img.play && (
                        <span className="text-[10px] bg-primary/40 px-1.5 rounded truncate max-w-[100px]">{img.play.title}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-white"
                      onClick={() => handleEdit(img)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4 text-black" />
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(img.id)}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManager;