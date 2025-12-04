import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, Upload, Loader2, Plus, Pencil, Save } from "lucide-react";
import { GalleryItem, Play } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminGalleryManager = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Estado para edición
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulario
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedPlayId, setSelectedPlayId] = useState<string>("none");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: galleryData, error: galleryError } = await supabase
        .from("gallery")
        .select(`*, play:plays(title)`)
        .order("created_at", { ascending: false });

      if (galleryError) throw galleryError;
      setImages((galleryData as unknown) as GalleryItem[]);

      const { data: playsData, error: playsError } = await supabase
        .from("plays")
        .select("*")
        .order("title");
      
      if (playsError) throw playsError;
      setPlays(playsData || []);

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setSelectedPlayId(item.play_id || "none");
    setFile(null); // Reseteamos el archivo, si no sube uno nuevo se mantiene el anterior
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!title || !category) {
      toast({ variant: "destructive", title: "Faltan datos", description: "El título y la categoría son obligatorios." });
      return;
    }
    // Si NO estamos editando, la imagen es obligatoria
    if (!editingId && !file) {
      toast({ variant: "destructive", title: "Imagen requerida", description: "Debes seleccionar una imagen para subir." });
      return;
    }

    setUploading(true);
    try {
      let publicUrl = "";

      // 1. Si hay un archivo nuevo, lo subimos (tanto para crear como para editar)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName);
          
        publicUrl = data.publicUrl;
      }

      // Preparamos los datos comunes
      const itemData = {
        title,
        category,
        play_id: selectedPlayId === "none" ? null : selectedPlayId,
      };

      if (editingId) {
        // --- MODO ACTUALIZAR ---
        // Solo añadimos image_url si se subió una nueva
        const updateData = publicUrl ? { ...itemData, image_url: publicUrl } : itemData;

        const { error: updateError } = await supabase
          .from("gallery")
          .update(updateData)
          .eq("id", editingId);

        if (updateError) throw updateError;
        toast({ title: "Actualizado", description: "Imagen actualizada correctamente" });

      } else {
        // --- MODO CREAR ---
        const { error: insertError } = await supabase
          .from("gallery")
          .insert({
            ...itemData,
            image_url: publicUrl // Aquí sí es obligatoria la URL nueva
          });

        if (insertError) throw insertError;
        toast({ title: "Creado", description: "Imagen añadida a la galería" });
      }

      setDialogOpen(false);
      resetForm();
      fetchData();

    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      const { error: dbError } = await supabase.from("gallery").delete().eq("id", id);
      if (dbError) throw dbError;

      // Intentar borrar del storage (opcional)
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('gallery-images').remove([fileName]);
      }

      toast({ title: "Eliminado", description: "Imagen eliminada correctamente" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setSelectedPlayId("none");
    setFile(null);
    setEditingId(null); // Importante: resetear el ID de edición
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Galería de Imágenes</h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm(); // Limpiar formulario al cerrar
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Imagen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Imagen" : "Agregar Imagen"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Título / Descripción *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Escena final" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Espacios">Espacios</SelectItem>
                      <SelectItem value="Ensayos">Ensayos</SelectItem>
                      <SelectItem value="Funciones">Funciones</SelectItem>
                      <SelectItem value="Historia">Historia</SelectItem>
                      <SelectItem value="Backstage">Backstage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

              <div className="space-y-2">
                <Label>{editingId ? "Reemplazar Imagen (Opcional)" : "Imagen *"}</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required={!editingId} />
                {editingId && !file && (
                  <p className="text-xs text-muted-foreground">Si no seleccionas un archivo, se mantendrá la imagen actual.</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {uploading ? "Guardando..." : editingId ? "Guardar Cambios" : "Subir Imagen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group relative">
              <div className="aspect-square relative">
                <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center cursor-default gap-2">
                  <p className="font-bold text-sm line-clamp-1">{img.title}</p>
                  <p className="text-xs text-gray-300">{img.category}</p>
                  {img.play && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full border border-primary/30">
                      {img.play.title}
                    </span>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    {/* Botón Editar */}
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-white"
                      onClick={() => handleEdit(img)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4 text-black" />
                    </Button>
                    
                    {/* Botón Borrar */}
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(img.id, img.image_url)}
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