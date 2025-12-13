import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Workshop } from "@/types";
import { useToast } from "@/hooks/use-toast";
import WorkshopDialog from "./WorkshopDialog";

const AdminWorkshopsTable = () => {
  const { toast } = useToast();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkshops((data as any) as Workshop[]);
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este taller?")) return;
    try {
      const { error } = await supabase.from("workshops").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Taller eliminado" });
      fetchWorkshops();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingWorkshop(null);
    setDialogOpen(true);
  };

  if (loading) return <p>Cargando talleres...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display">Talleres</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Taller
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Inscritos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workshops.map((workshop) => (
              <TableRow key={workshop.id}>
                <TableCell className="font-medium">{workshop.title}</TableCell>
                <TableCell>{workshop.instructor}</TableCell>
                <TableCell>{workshop.level}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Máx. {workshop.max_students}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(workshop)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(workshop.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <WorkshopDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        workshop={editingWorkshop}
        onSuccess={fetchWorkshops}
      />
    </div>
  );
};

export default AdminWorkshopsTable;