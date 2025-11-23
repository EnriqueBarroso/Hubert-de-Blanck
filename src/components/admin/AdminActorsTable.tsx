import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ActorDialog from "./ActorDialog";

export interface Actor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const AdminActorsTable = () => {
  const { toast } = useToast();
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActor, setEditingActor] = useState<Actor | null>(null);

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const { data, error } = await supabase
        .from("actors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActors(data || []);
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

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este actor?")) return;

    try {
      const { error } = await supabase
        .from("actors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Actor eliminado",
        description: "El actor se ha eliminado correctamente.",
      });
      fetchActors();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (actor: Actor) => {
    setEditingActor(actor);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingActor(null);
    setDialogOpen(true);
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">Cargando...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display">Elenco</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Actor
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actors.map((actor) => (
              <TableRow key={actor.id}>
                <TableCell className="font-medium">{actor.name}</TableCell>
                <TableCell>{actor.role}</TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ActorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        actor={editingActor}
        onSuccess={fetchActors}
      />
    </div>
  );
};

export default AdminActorsTable;
