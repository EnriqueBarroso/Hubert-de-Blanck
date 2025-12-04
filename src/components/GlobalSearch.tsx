import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Theater, User, Calendar, FileText, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { Play, Actor } from "@/types";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [plays, setPlays] = useState<Play[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Atajo de teclado (Ctrl+K o Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Búsqueda en Supabase con debounce (espera a que termines de escribir)
  useEffect(() => {
    if (!query) {
      setPlays([]);
      setActors([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      
      // Buscar Producciones (título o autor)
      const { data: playsData } = await supabase
        .from("plays")
        .select("*")
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(3);

      if (playsData) setPlays(playsData);

      // Buscar Actores (nombre o rol)
      const { data: actorsData } = await supabase
        .from("actors")
        .select("*")
        .or(`name.ilike.%${query}%,role.ilike.%${query}%`)
        .limit(3);

      if (actorsData) setActors(actorsData);
      
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground w-40 lg:w-64 justify-between"
      >
        <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Buscar...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Busca obras, actores..." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>
             {loading ? (
                 <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Buscando...
                 </div>
             ) : (
                 "No se encontraron resultados."
             )}
          </CommandEmpty>
          
          {plays.length > 0 && (
            <CommandGroup heading="Producciones">
              {plays.map((play) => (
                <CommandItem
                  key={play.id}
                  onSelect={() => runCommand(() => navigate(`/producciones/${play.id}`))}
                  className="cursor-pointer"
                >
                  <Theater className="mr-2 h-4 w-4 text-primary" />
                  <span>{play.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">({play.category})</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {actors.length > 0 && (
            <CommandGroup heading="Elenco">
              {actors.map((actor) => (
                <CommandItem
                  key={actor.id}
                  onSelect={() => runCommand(() => navigate(`/elenco`))}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4 text-secondary" />
                  <span>{actor.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          <CommandSeparator />
          
          <CommandGroup heading="Acceso Rápido">
             <CommandItem onSelect={() => runCommand(() => navigate("/cartelera"))} className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Ver Cartelera</span>
             </CommandItem>
             <CommandItem onSelect={() => runCommand(() => navigate("/blog"))} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Leer Blog</span>
             </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}