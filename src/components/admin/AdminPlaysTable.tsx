import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PlayDialog from "./PlayDialog";
// 1. Importamos el tipo centralizado
import { Play } from "@/types";
import CastManager from "./CastManager"; // Importar el nuevo componente
import { Users } from "lucide-react"; // Importar icono

const AdminPlaysTable = () => {
  const { toast } = useToast();
  // Play ahora viene de tus tipos globales, asegurando consistencia
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlay, setEditingPlay] = useState<Play | null>(null);
  const [castManagerOpen, setCastManagerOpen] = useState(false);
  const [selectedPlayForCast, setSelectedPlayForCast] = useState<Play | null>(null);

  useEffect(() => {
    fetchPlays();
  }, []);

  const fetchPlays = async () => {
    try {
      const { data, error } = await supabase
        .from("plays")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPlays(data || []);
    } catch (error: unknown) {
      // 2. Manejo seguro de errores sin 'any'
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar";

      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las producciones: " + errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta producción?")) return;

    try {
      const { error } = await supabase
        .from("plays")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Producción eliminada",
        description: "La producción se ha eliminado correctamente.",
      });
      fetchPlays();
    } catch (error: unknown) {
      // 2. Manejo seguro de errores sin 'any'
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleEdit = (play: Play) => {
    setEditingPlay(play);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPlay(null);
    setDialogOpen(true);
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">Cargando...</p>;
  }

  const handleManageCast = (play: Play) => {
    setSelectedPlayForCast(play);
    setCastManagerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display">Producciones</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producción
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Año</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plays.map((play) => (
              <TableRow key={play.id}>
                <TableCell className="font-medium">{play.title}</TableCell>
                <TableCell>{play.author}</TableCell>
                <TableCell>{play.category}</TableCell>
                <TableCell>{play.year || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleManageCast(play)}
                    title="Gestionar Elenco"
                  >
                    <Users className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(play)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(play.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PlayDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        play={editingPlay}
        onSuccess={fetchPlays}
      />
      {selectedPlayForCast && (
        <CastManager 
          play={selectedPlayForCast}
          open={castManagerOpen}
          onOpenChange={setCastManagerOpen}
        />
      )}
    </div>
  );
};

export default AdminPlaysTable;