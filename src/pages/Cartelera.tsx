import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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
import { Calendar as CalendarIcon, Clock, MapPin, Ticket, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import eventMusical from "@/assets/event-musical.jpg";
import eventContemporary from "@/assets/event-contemporary.jpg";
import eventWorkshop from "@/assets/event-workshop.jpg";

type EventType = "Todos" | "Teatro" | "Musical" | "Taller";

interface Event {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time: string;
  venue: string;
  price: number;
  image: string;
  description: string;
  availableSeats: number;
}

const Cartelera = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<EventType>("Todos");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const events: Event[] = [
    {
      id: "1",
      title: "La Casa de Bernarda Alba",
      type: "Teatro",
      date: new Date(2024, 11, 15),
      time: "20:00",
      venue: "Sala Principal",
      price: 25,
      image: eventContemporary,
      description: "Una obra maestra de Federico García Lorca que explora el poder, la represión y la libertad femenina en la España rural.",
      availableSeats: 45,
    },
    {
      id: "2",
      title: "Chicago - El Musical",
      type: "Musical",
      date: new Date(2024, 11, 20),
      time: "21:00",
      venue: "Sala Principal",
      price: 35,
      image: eventMusical,
      description: "El deslumbrante musical de Broadway llega a nuestro escenario con todo su jazz, glamour y corrupción.",
      availableSeats: 30,
    },
    {
      id: "3",
      title: "Taller de Actuación Intensivo",
      type: "Taller",
      date: new Date(2024, 11, 16),
      time: "10:00",
      venue: "Estudio de Ensayo",
      price: 45,
      image: eventWorkshop,
      description: "Workshop intensivo de técnicas de actuación contemporánea con enfoque en el método Stanislavski.",
      availableSeats: 15,
    },
    {
      id: "4",
      title: "En el Bosque",
      type: "Musical",
      date: new Date(2024, 11, 22),
      time: "19:30",
      venue: "Sala Principal",
      price: 30,
      image: eventMusical,
      description: "Un viaje musical a través de cuentos de hadas entrelazados, donde los deseos se hacen realidad con consecuencias inesperadas.",
      availableSeats: 50,
    },
    {
      id: "5",
      title: "Hamlet Contemporáneo",
      type: "Teatro",
      date: new Date(2024, 11, 28),
      time: "20:30",
      venue: "Sala Principal",
      price: 28,
      image: eventContemporary,
      description: "Una reinterpretación vanguardista del clásico de Shakespeare ambientada en un mundo corporativo moderno.",
      availableSeats: 40,
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesType = filterType === "Todos" || event.type === filterType;
    const matchesDate = !selectedDate || 
      format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    return matchesType && matchesDate;
  });

  const eventDates = events.map(e => e.date);

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      toast.success("Reserva confirmada", {
        description: `${ticketQuantity} entrada(s) para ${selectedEvent.title} el ${format(selectedEvent.date, "d 'de' MMMM", { locale: es })}`,
      });
      setSelectedEvent(null);
      setTicketQuantity(1);
    }
  };

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case "Musical":
        return "bg-secondary text-secondary-foreground";
      case "Teatro":
        return "bg-primary text-primary-foreground";
      case "Taller":
        return "bg-theater-copper text-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-theater-darker to-background">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-6xl md:text-7xl font-bold text-foreground mb-6">
            Cartelera
          </h1>
          <p className="font-outfit text-lg text-muted-foreground max-w-2xl">
            Descubre nuestras próximas presentaciones y asegura tu lugar en las mejores producciones teatrales
          </p>
        </div>
      </section>

      {/* Filters and Calendar */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
                  Selecciona una fecha
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={es}
                  className={cn("rounded-md border border-border pointer-events-auto")}
                  modifiers={{
                    event: eventDates,
                  }}
                  modifiersStyles={{
                    event: {
                      fontWeight: 'bold',
                      color: 'hsl(var(--primary))',
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
                      <SelectItem value="Taller">Taller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-playfair text-2xl font-bold text-foreground">
                  {selectedDate 
                    ? `Eventos del ${format(selectedDate, "d 'de' MMMM", { locale: es })}`
                    : "Todos los eventos"}
                </h3>
                <Badge variant="outline" className="font-outfit">
                  {filteredEvents.length} evento(s)
                </Badge>
              </div>

              <div className="space-y-6">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="font-outfit text-muted-foreground">
                      No hay eventos para esta fecha
                    </p>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors group"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative aspect-video md:aspect-square overflow-hidden">
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

                        <div className="md:col-span-2 p-6 flex flex-col justify-between">
                          <div>
                            <h4 className="font-playfair text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>
                            <p className="font-outfit text-muted-foreground mb-4 line-clamp-2">
                              {event.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm font-outfit">
                                <CalendarIcon className="h-4 w-4 text-primary" />
                                <span>{format(event.date, "d 'de' MMMM, yyyy", { locale: es })}</span>
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
                                <span>{event.availableSeats} asientos disponibles</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-outfit text-sm text-muted-foreground">Desde</p>
                              <p className="font-playfair text-3xl font-bold text-foreground">
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
                                  Reservar entradas
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="font-playfair text-2xl">
                                    Reservar Entradas
                                  </DialogTitle>
                                  <DialogDescription className="font-outfit">
                                    {event.title}
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleReservation} className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="name" className="font-outfit">Nombre completo</Label>
                                    <Input
                                      id="name"
                                      placeholder="Tu nombre"
                                      required
                                      className="font-outfit"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="email" className="font-outfit">Correo electrónico</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      placeholder="tu@email.com"
                                      required
                                      className="font-outfit"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="quantity" className="font-outfit">Cantidad de entradas</Label>
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
                                  <div className="bg-muted p-4 rounded-lg">
                                    <div className="flex justify-between items-center font-outfit">
                                      <span>Subtotal:</span>
                                      <span className="font-bold">${event.price * ticketQuantity}</span>
                                    </div>
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

      {/* Footer */}
      <footer className="bg-theater-darker py-12 border-t border-border mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-playfair text-2xl font-bold tracking-wide mb-4">
                <span className="text-primary">Hubert</span>
                <span className="text-foreground"> de </span>
                <span className="text-secondary">Blanck</span>
              </div>
              <p className="font-outfit text-sm text-muted-foreground">
                Teatro contemporáneo y vanguardista
              </p>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground mb-4">Navegación</h3>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors">Inicio</a></li>
                <li><a href="/cartelera" className="hover:text-primary transition-colors">Cartelera</a></li>
                <li><a href="/compania" className="hover:text-primary transition-colors">La Compañía</a></li>
                <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li>info@hubertdeblanck.com</li>
                <li>+1 (555) 123-4567</li>
                <li>La Habana, Cuba</li>
              </ul>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground mb-4">Síguenos</h3>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center font-outfit text-sm text-muted-foreground">
            <p>&copy; 2024 Compañía Hubert de Blanck. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cartelera;
