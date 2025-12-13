import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, PlayInsert, PlayUpdate } from "@/types";
import { Upload, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  play: Play | null;
  onSuccess: () => void;
}

const PlayDialog = ({ open, onOpenChange, play, onSuccess }: PlayDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // 1. AÑADIDO: campo director en el estado inicial
  const [formData, setFormData] = useState<PlayInsert>({
    id: "",
    title: "",
    author: "",
    description: "",
    image: "",
    category: "",
    year: undefined,
    status: "cartelera",
    date: "",
    time: "",
    venue: "",
    availability: "disponible",
  });

  useEffect(() => {
    if (play) {
      setFormData({
        id: play.id,
        title: play.title,
        author: play.author,
        description: play.description,
        image: play.image,
        category: play.category,
        year: play.year,
        status: play.status,
        date: play.date,
        time: play.time,
        venue: play.venue,
        availability: play.availability,
      });
    } else {
      setFormData({
        id: "",
        title: "",
        author: "",
        description: "",
        image: "",
        category: "",
        year: new Date().getFullYear(),
        status: "cartelera",
        date: "",
        time: "",
        venue: "Sala Principal",
        availability: "disponible",
      });
    }
  }, [play, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('play-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('play-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      
      toast({
        title: "Imagen subida",
        description: "La imagen se ha cargado correctamente",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al subir imagen";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (play) {
        const { error } = await supabase
          .from("plays")
          .update(formData as PlayUpdate)
          .eq("id", play.id);

        if (error) throw error;
        toast({ title: "Éxito", description: "Producción actualizada correctamente." });
      } else {
        const { error } = await supabase
          .from("plays")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Éxito", description: "Producción creada correctamente." });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{play ? "Editar Producción" : "Nueva Producción"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID (slug) *</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
                disabled={!!play}
                placeholder="ej: romeo-y-julieta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagen de Portada</Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                    className="absolute top-0 right-0 p-1 bg-black/50 text-white hover:bg-black/70"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors">
                    {uploading ? (
                      <Loader2 className="animate-spin text-muted-foreground" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload size={20} />
                        <span className="text-xs mt-1">Subir imagen</span>
                      </div>
                    )}
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </Label>
              </div>
            </div>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="O pega una URL directa..."
              className="text-xs text-muted-foreground mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          {/* Autor y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="Teatro, Musical..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={formData.status || "cartelera"}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cartelera">En Cartelera</SelectItem>
                  <SelectItem value="repertorio">En Repertorio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Lugar</Label>
              <Input
                id="venue"
                value={formData.venue || ""}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Sala Principal"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                value={formData.year || ""}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha (Texto)</Label>
              <Input
                id="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="20 Octubre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="20:00"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : play ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayDialog;