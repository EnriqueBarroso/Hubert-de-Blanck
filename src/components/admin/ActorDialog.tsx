import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { ActorInsert, ActorUpdate } from "@/types";

// Definimos la interfaz localmente o impórtala si la tienes en types
interface Actor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  time_period?: string | null; // Nuevo campo opcional
}

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
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
    time_period: "Actualidad", // Valor por defecto
  });

  useEffect(() => {
    if (actor) {
      setFormData({
        name: actor.name,
        role: actor.role,
        bio: actor.bio,
        image: actor.image,
        time_period: actor.time_period || "Actualidad",
      });
    } else {
      setFormData({
        name: "",
        role: "",
        bio: "",
        image: "",
        time_period: "Actualidad",
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
      
      const { error: uploadError } = await supabase.storage
        .from('actor-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('actor-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      toast({ title: "Imagen subida correctamente" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
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
          .update(formData as any) // Usamos any o actualiza tus tipos en 'types/index.ts'
          .eq("id", actor.id);
        if (error) throw error;
        toast({ title: "Actor actualizado" });
      } else {
        const { error } = await supabase
          .from("actors")
          .insert([formData as any]);
        if (error) throw error;
        toast({ title: "Actor creado" });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{actor ? "Editar Actor" : "Nuevo Actor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Rol (ej: Actor, Director) *</Label>
              <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
            </div>
          </div>
          
          {/* CAMPO NUEVO: PERIODO */}
          <div className="space-y-2">
            <Label>Periodo / Etapa *</Label>
            <Input 
                value={formData.time_period} 
                onChange={e => setFormData({...formData, time_period: e.target.value})} 
                placeholder="Ej: Actualidad, 2010-2019, Fundadores..."
                required 
            />
            <p className="text-xs text-muted-foreground">Úsalo para agrupar actores por décadas o etapas.</p>
          </div>

          <div className="space-y-2">
            <Label>Biografía *</Label>
            <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={5} required />
          </div>

          <div className="space-y-2">
            <Label>Foto</Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-12 h-12 object-cover rounded-full" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActorDialog;