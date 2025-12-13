import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, UserPlus, Users } from "lucide-react";
import { Actor, Play, PlayActor } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CastManagerProps {
  play: Play;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CastManager = ({ play, open, onOpenChange }: CastManagerProps) => {
  const { toast } = useToast();
  const [cast, setCast] = useState<PlayActor[]>([]);
  const [allActors, setAllActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulario para añadir
  const [selectedActorId, setSelectedActorId] = useState<string>("");
  const [characterName, setCharacterName] = useState<string>("");

  useEffect(() => {
    if (open && play) {
      fetchData();
    }
  }, [open, play]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener todos los actores disponibles
      const { data: actorsData } = await supabase
        .from("actors")
        .select("*")
        .order("name");
      
      setAllActors(actorsData || []);

      // 2. Obtener el elenco actual de esta obra
      // CORRECCIÓN AQUÍ: Separamos la consulta para evitar el error de "deep instantiation"
      // Usamos un cast explícito (as unknown as PlayActor[]) para decirle a TS qué estructura esperar
      // y evitar que intente inferirla recursivamente.
      const { data: castData, error } = await supabase
        .from("play_actors")
        .select(`
          *,
          actor:actors(*)
        `)
        .eq("play_id", play.id);

      if (error) throw error;
      
      // Asignamos directamente usando el cast seguro
      // TypeScript confiará en que 'castData' cumple con la estructura PlayActor[]
      setCast((castData as unknown) as PlayActor[]);

    } catch (error) {
      console.error("Error cargando elenco:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el elenco" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddActor = async () => {
    if (!selectedActorId || !characterName) return;

    try {
      const { error } = await supabase
        .from("play_actors")
        .insert({
          play_id: play.id,
          actor_id: selectedActorId,
          role_in_play: characterName
        });

      if (error) throw error;

      toast({ title: "Actor añadido", description: "Se ha vinculado el actor a la obra." });
      
      // Limpiar y recargar
      setSelectedActorId("");
      setCharacterName("");
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo añadir el actor" });
    }
  };

  const handleRemoveActor = async (id: string) => {
    try {
      const { error } = await supabase
        .from("play_actors")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({ title: "Actor removido", description: "Se ha desvinculado el actor de la obra." });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestionar Elenco: {play.title}
          </DialogTitle>
          <DialogDescription>
            Asigna actores a esta producción y define sus personajes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4 flex-1 overflow-hidden">
          {/* Formulario para añadir */}
          <div className="bg-muted/30 p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <Label>Seleccionar Actor</Label>
              <Select value={selectedActorId} onValueChange={setSelectedActorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Busca un actor..." />
                </SelectTrigger>
                <SelectContent>
                  {allActors.map((actor) => (
                    <SelectItem key={actor.id} value={actor.id}>
                      {actor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full space-y-2">
              <Label>Personaje</Label>
              <Input 
                value={characterName} 
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Ej: Romeo, La Poncia..." 
              />
            </div>
            <Button onClick={handleAddActor} disabled={!selectedActorId || !characterName}>
              <UserPlus className="mr-2 h-4 w-4" /> Añadir
            </Button>
          </div>

          {/* Lista de elenco actual */}
          <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
            <div className="bg-muted p-3 border-b grid grid-cols-12 text-sm font-medium">
              <div className="col-span-5">Actor / Actriz</div>
              <div className="col-span-5">Personaje</div>
              <div className="col-span-2 text-right">Acción</div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">Cargando...</div>
                ) : cast.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No hay actores asignados a esta obra aún.
                  </div>
                ) : (
                  cast.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 p-3 items-center text-sm hover:bg-muted/20">
                      <div className="col-span-5 flex items-center gap-3">
                        {item.actor?.image && (
                          <img 
                            src={item.actor.image} 
                            alt={item.actor.name} 
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        )}
                        <span className="font-medium">{item.actor?.name || "Actor desconocido"}</span>
                      </div>
                      <div className="col-span-5 text-muted-foreground">
                        {item.role_in_play}
                      </div>
                      <div className="col-span-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                          onClick={() => handleRemoveActor(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CastManager;