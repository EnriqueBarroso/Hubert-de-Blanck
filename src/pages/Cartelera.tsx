import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, MapPin, Ticket, Users, AlertCircle } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Play } from "@/types";

type EventType = "Todos" | "Teatro" | "Musical" | "Taller" | "Contemporáneo";

interface EventView extends Omit<Play, 'id'> {
  id: string;
  type: EventType;
  dateObj: Date;
  price: number;
  availableSeats: number;
}

const Cartelera = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<EventType>("Todos");
  const [selectedEvent, setSelectedEvent] = useState<EventView | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const [events, setEvents] = useState<EventView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("plays")
        .select("*")
        .eq('status', 'cartelera');

      if (error) throw error;

      const adaptedEvents: EventView[] = (data || []).map((play) => {
        let parsedDate = new Date();
        if (play.date && isValid(parseISO(play.date))) {
          parsedDate = parseISO(play.date);
        }

        let type: EventType = "Teatro";
        const cat = play.category?.toLowerCase() || "";
        if (cat.includes("musical")) type = "Musical";
        else if (cat.includes("taller")) type = "Taller";
        else if (cat.includes("contempor")) type = "Contemporáneo";

        return {
          ...play,
          id: play.id,
          type: type,
          dateObj: parsedDate,
          price: 25,
          availableSeats: 45,
          title: play.title || "Título no disponible",
          image: play.image || "/placeholder.svg",
          description: play.description || "",
          venue: play.venue || "Sala Principal",
          time: play.time || "20:00"
        };
      });

      setEvents(adaptedEvents);
    } catch (error: unknown) {
      console.error("Error al cargar cartelera:", error);
      toast.error("Error al cargar la cartelera");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesType = filterType === "Todos" || event.type === filterType;
    const matchesDate = !selectedDate ||
      format(event.dateObj, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    return matchesType;
  });

  const eventDates = events.map(e => e.dateObj);

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      toast.success("Reserva confirmada", {
        description: `${ticketQuantity} entrada(s) para ${selectedEvent.title} el ${format(selectedEvent.dateObj, "d 'de' MMMM", { locale: es })}`,
      });
      setSelectedEvent(null);
      setTicketQuantity(1);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Musical":
        return "bg-secondary text-secondary-foreground";
      case "Teatro":
      case "Contemporáneo":
        return "bg-primary text-primary-foreground";
      case "Taller":
        return "bg-theater-copper text-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-24 sm:pt-32 pb-8 sm:pb-16 bg-gradient-to-b from-theater-darker to-background">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6">
            Cartelera
          </h1>
          <p className="font-outfit text-base sm:text-lg text-muted-foreground max-w-2xl">
            Descubre nuestras próximas presentaciones y asegura tu lugar en las mejores producciones teatrales
          </p>
        </div>
      </section>

      {/* Filters and Calendar */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Calendar Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border lg:sticky lg:top-24">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-foreground mb-4">
                  Selecciona una fecha
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={es}
                  className={cn("rounded-md border border-border pointer-events-auto flex justify-center")}
                  modifiers={{
                    event: eventDates,
                  }}
                  modifiersStyles={{
                    event: {
                      fontWeight: 'bold',
                      color: 'hsl(var(--primary))',
                      textDecoration: 'underline'
                    },
                  }}
                />

                <div className="mt-6">
                  <Label className="font-outfit text-sm font-medium mb-2 block">
                    Filtrar por tipo
                  </Label>
                  <Select value={filterType} onValueChange={(value) => setFilterType(value as EventType)}>
                    <SelectTrigger className="font-outfit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Teatro">Teatro</SelectItem>
                      <SelectItem value="Musical">Musical</SelectItem>
                      <SelectItem value="Contemporáneo">Contemporáneo</SelectItem>
                      <SelectItem value="Taller">Taller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
                  {selectedDate
                    ? `Eventos disponibles`
                    : "Todos los eventos"}
                </h3>
                <Badge variant="outline" className="font-outfit text-xs sm:text-sm">
                  {loading ? "..." : filteredEvents.length} evento(s)
                </Badge>
              </div>

              <div className="space-y-6">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-lg border border-border overflow-hidden h-64 flex">
                      <Skeleton className="w-1/3 h-full" />
                      <div className="w-2/3 p-6 space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="font-outfit text-muted-foreground text-lg">
                      No hay eventos programados con estos filtros.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => { setSelectedDate(undefined); setFilterType("Todos") }}
                      className="mt-2 text-primary"
                    >
                      Ver todos los eventos
                    </Button>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors group"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative aspect-video md:aspect-square overflow-hidden md:h-full">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={cn("font-outfit uppercase font-bold", getEventTypeColor(event.type))}>
                              {event.type}
                            </Badge>
                          </div>
                        </div>

                          <div className="md:col-span-2 p-4 sm:p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <h4 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {event.title}
                              </h4>
                              {event.status === 'repertorio' && (
                                <Badge variant="secondary">En repertorio</Badge>
                              )}
                            </div>

                            <p className="font-outfit text-muted-foreground mb-4 line-clamp-2">
                              {event.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm font-outfit">
                                <CalendarIcon className="h-4 w-4 text-primary" />
                                <span>{event.date || format(event.dateObj, "d MMM yyyy", { locale: es })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm font-outfit">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{event.time} hrs</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm font-outfit">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{event.venue}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm font-outfit">
                                <Users className="h-4 w-4 text-primary" />
                                <span>{event.availableSeats} asientos</span>
                              </div>
                            </div>
                          </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border md:border-0 md:pt-0">
                            <div>
                              <p className="font-outfit text-xs sm:text-sm text-muted-foreground">Entrada</p>
                              <p className="font-playfair text-2xl sm:text-3xl font-bold text-foreground">
                                ${event.price}
                              </p>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit"
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <Ticket className="mr-2 h-4 w-4" />
                                  Reservar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="font-playfair text-2xl">
                                    Reservar Entradas
                                  </DialogTitle>
                                  <DialogDescription className="font-outfit">
                                    {event.title} - {event.venue}
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleReservation} className="space-y-4">
                                  <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground flex gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Esta es una reserva provisional. El pago se realiza en taquilla.</span>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="name" className="font-outfit">Nombre completo</Label>
                                    <Input id="name" required className="font-outfit" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="email" className="font-outfit">Correo electrónico</Label>
                                    <Input id="email" type="email" required className="font-outfit" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="quantity" className="font-outfit">Cantidad</Label>
                                    <Select
                                      value={ticketQuantity.toString()}
                                      onValueChange={(value) => setTicketQuantity(parseInt(value))}
                                    >
                                      <SelectTrigger className="font-outfit">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                          <SelectItem key={num} value={num.toString()}>
                                            {num} entrada{num > 1 ? 's' : ''}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="bg-muted p-4 rounded-lg flex justify-between items-center font-outfit">
                                    <span>Total a pagar:</span>
                                    <span className="font-bold text-xl">${event.price * ticketQuantity}</span>
                                  </div>
                                  <Button
                                    type="submit"
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-outfit"
                                  >
                                    Confirmar reserva
                                  </Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cartelera;