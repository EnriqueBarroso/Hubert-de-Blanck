import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Workshop, WorkshopInsert, WorkshopUpdate } from "@/types";

interface WorkshopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: Workshop | null;
  onSuccess: () => void;
}

const WorkshopDialog = ({ open, onOpenChange, workshop, onSuccess }: WorkshopDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<WorkshopInsert>({
    title: "",
    description: "",
    instructor: "",
    level: "Principiante",
    duration: "",
    schedule: "",
    max_students: 20,
    price: "0",
    image: "",
    category: "",
  });

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        instructor: workshop.instructor,
        level: workshop.level || "Principiante",
        duration: workshop.duration || "",
        schedule: workshop.schedule || "",
        max_students: workshop.max_students || 20,
        price: workshop.price || "0",
        image: workshop.image || "",
        category: workshop.category || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        instructor: "",
        level: "Principiante",
        duration: "",
        schedule: "",
        max_students: 20,
        price: "0",
        image: "",
        category: "",
      });
    }
  }, [workshop, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('play-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('play-images')
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
      if (workshop) {
        const { error } = await supabase
          .from("workshops")
          .update(formData as WorkshopUpdate)
          .eq("id", workshop.id);
        if (error) throw error;
        toast({ title: "Taller actualizado" });
      } else {
        const { error } = await supabase
          .from("workshops")
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Taller creado" });
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workshop ? "Editar Taller" : "Nuevo Taller"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Nivel *</Label>
              <Select value={formData.level || "Principiante"} onValueChange={v => setFormData({...formData, level: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principiante">Principiante</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción *</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instructor *</Label>
              <Input value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Input value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Actuación, Voz, etc." />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Duración</Label>
              <Input value={formData.duration || ""} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Ej: 12 semanas" />
            </div>
            <div className="space-y-2">
              <Label>Horario</Label>
              <Input value={formData.schedule || ""} onChange={e => setFormData({...formData, schedule: e.target.value})} placeholder="Sábados 10am" />
            </div>
            <div className="space-y-2">
              <Label>Precio</Label>
              <Input value={formData.price || ""} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="$100" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cupo Máximo</Label>
            <Input type="number" value={formData.max_students || 20} onChange={e => setFormData({...formData, max_students: Number(e.target.value)})} />
          </div>

          <div className="space-y-2">
            <Label>Imagen</Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : "Guardar Taller"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopDialog;