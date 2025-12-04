import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
import { Actor, ActorInsert, ActorUpdate } from "@/types";

interface ActorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actor: Actor | null;
  onSuccess: () => void;
}

const ActorDialog = ({ open, onOpenChange, actor, onSuccess }: ActorDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<ActorInsert>({
    id: "",
    name: "",
    role: "Actor", // Valor por defecto
    bio: "",
    image: "",
  });

  useEffect(() => {
    if (actor) {
      setFormData({
        id: actor.id,
        name: actor.name,
        role: actor.role,
        bio: actor.bio,
        image: actor.image,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        role: "Actor",
        bio: "",
        image: "",
      });
    }
  }, [actor, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('actor-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('actor-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      
      toast({ title: "Foto subida", description: "La foto se ha cargado correctamente" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al subir imagen";
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (actor) {
        const { error } = await supabase
          .from("actors")
          .update(formData as ActorUpdate)
          .eq("id", actor.id);
        if (error) throw error;
        toast({ title: "Actor actualizado", description: "Datos guardados correctamente." });
      } else {
        const { error } = await supabase
          .from("actors")
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Actor creado", description: "Actor añadido a la base de datos." });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{actor ? "Editar Actor" : "Nuevo Actor"}</DialogTitle>
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
                  disabled={!!actor}
                  placeholder="ej: nombre-apellido"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border bg-muted">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                    className="absolute top-0 right-0 p-1 bg-black/50 text-white hover:bg-black/70 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="actor-image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors">
                    {uploading ? (
                      <Loader2 className="animate-spin text-muted-foreground" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload size={20} />
                        <span className="text-xs mt-1">Subir foto</span>
                      </div>
                    )}
                  </div>
                  <Input
                    id="actor-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol Principal (Ej: Actriz, Director, Músico)</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : actor ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActorDialog;