import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Actor } from "@/types"; // Importamos el tipo actualizado con role_type y era

// Opciones predefinidas
const ROLES = [
  { value: "actor", label: "Actor / Actriz" },
  { value: "director", label: "Director/a" },
  { value: "ambos", label: "Ambos (Director y Actor)" },
];

const ERAS = [
  "Fundadores",
  "Maestros",
  "1990-2010",
  "2011-2020",
  "Elenco Actual",
];

const AdminActorsTable = () => {
  const { toast } = useToast();
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    bio: "",
    image: "",
    role_type: "actor",
    era: "Elenco Actual",
  });

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const { data, error } = await supabase
        .from("actors")
        .select("*")
        .order("name");

      if (error) throw error;
      
      // Mapeo seguro para evitar errores si las columnas nuevas están vacías
      const safeData = (data || []).map((item: any) => ({
        ...item,
        role_type: item.role_type || 'actor',
        era: item.era || 'Elenco Actual'
      }));

      setActors(safeData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar el elenco.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      bio: "",
      image: "",
      role_type: "actor",
      era: "Elenco Actual",
    });
  };

  const handleEdit = (actor: Actor) => {
    setFormData({
      id: actor.id,
      name: actor.name,
      bio: actor.bio || "",
      image: actor.image || "",
      role_type: actor.role_type || "actor",
      era: actor.era || "Elenco Actual",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast({ variant: "destructive", title: "El nombre es obligatorio" });
      return;
    }

    setUploading(true);
    try {
      const actorData = {
        name: formData.name,
        bio: formData.bio,
        image: formData.image,
        role_type: formData.role_type,
        era: formData.era,
      };

      if (formData.id) {
        // Actualizar
        const { error } = await supabase
          .from("actors")
          .update(actorData)
          .eq("id", formData.id);
        if (error) throw error;
        toast({ title: "Actor actualizado correctamente" });
      } else {
        // Crear nuevo
        const { error } = await supabase.from("actors").insert([actorData]);
        if (error) throw error;
        toast({ title: "Actor creado correctamente" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchActors();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este perfil?")) return;

    try {
      const { error } = await supabase.from("actors").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Perfil eliminado" });
      fetchActors();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">Cargando...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display">Elenco y Dirección</h2>
        
        {/* DIÁLOGO DE CREACIÓN / EDICIÓN */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Integrante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Editar Perfil" : "Nuevo Integrante"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Orietta Medina"
                />
              </div>

              {/* SELECTOR DE ROL */}
              <div className="space-y-2">
                <Label>Rol Principal</Label>
                <Select
                  value={formData.role_type}
                  onValueChange={(val) => setFormData({ ...formData, role_type: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SELECTOR DE ETAPA */}
              <div className="space-y-2">
                <Label>Etapa Histórica</Label>
                <Select
                  value={formData.era}
                  onValueChange={(val) => setFormData({ ...formData, era: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {ERAS.map((era) => (
                      <SelectItem key={era} value={era}>
                        {era}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Imagen (URL) */}
              <div className="space-y-2">
                <Label>URL de la Foto</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                    Copia la URL pública de la imagen desde la pestaña "Archivos" o "Galería".
                </p>
              </div>

              {/* Biografía */}
              <div className="space-y-2">
                <Label>Biografía Corta</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Trayectoria..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} disabled={uploading} className="w-full">
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formData.id ? "Guardar Cambios" : "Crear Integrante"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLA DE VISUALIZACIÓN */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol & Etapa</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actors.map((actor) => (
              <TableRow key={actor.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {actor.image ? (
                      <img src={actor.image} alt={actor.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{actor.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span className="font-medium text-foreground capitalize">{actor.role_type}</span>
                    <span>{actor.era}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(actor)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(actor.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminActorsTable;