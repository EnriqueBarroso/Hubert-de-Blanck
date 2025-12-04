import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
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
  const [featuresInput, setFeaturesInput] = useState("");

  const [formData, setFormData] = useState<WorkshopInsert>({
    title: "",
    description: "",
    long_description: "",
    instructor: "",
    instructor_bio: "",
    level: "Principiante",
    duration: "",
    schedule: "",
    max_students: 20,
    enrolled: 0,
    price: 0,
    image: "",
    features: [],
  });

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        long_description: workshop.long_description || "",
        instructor: workshop.instructor,
        instructor_bio: workshop.instructor_bio || "",
        level: workshop.level,
        duration: workshop.duration || "",
        schedule: workshop.schedule || "",
        max_students: workshop.max_students,
        enrolled: workshop.enrolled,
        price: workshop.price,
        image: workshop.image || "",
        features: workshop.features || [],
      });
      setFeaturesInput(workshop.features ? workshop.features.join("\n") : "");
    } else {
      setFormData({
        title: "",
        description: "",
        long_description: "",
        instructor: "",
        instructor_bio: "",
        level: "Principiante",
        duration: "",
        schedule: "",
        max_students: 20,
        enrolled: 0,
        price: 0,
        image: "",
        features: [],
      });
      setFeaturesInput("");
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
        .from('workshop-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('workshop-images')
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

    // Convertir features de string (textarea) a array
    const featuresArray = featuresInput.split("\n").filter(f => f.trim() !== "");
    const dataToSubmit = { ...formData, features: featuresArray };

    try {
      if (workshop) {
        const { error } = await supabase
          .from("workshops")
          .update(dataToSubmit as WorkshopUpdate)
          .eq("id", workshop.id);
        if (error) throw error;
        toast({ title: "Taller actualizado" });
      } else {
        const { error } = await supabase
          .from("workshops")
          .insert([dataToSubmit]);
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
              <Select value={formData.level} onValueChange={v => setFormData({...formData, level: v})}>
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
            <Label>Descripción Corta *</Label>
            <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <Label>Descripción Detallada</Label>
            <Textarea value={formData.long_description || ""} onChange={e => setFormData({...formData, long_description: e.target.value})} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instructor *</Label>
              <Input value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Bio Instructor</Label>
              <Input value={formData.instructor_bio || ""} onChange={e => setFormData({...formData, instructor_bio: e.target.value})} />
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
              <Label>Precio ($)</Label>
              <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cupo Máximo</Label>
              <Input type="number" value={formData.max_students} onChange={e => setFormData({...formData, max_students: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Inscritos Actuales</Label>
              <Input type="number" value={formData.enrolled} onChange={e => setFormData({...formData, enrolled: Number(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Características (Una por línea)</Label>
            <Textarea 
              value={featuresInput} 
              onChange={e => setFeaturesInput(e.target.value)} 
              placeholder="Ej: Certificado incluido&#10;Material de estudio"
              rows={4}
            />
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