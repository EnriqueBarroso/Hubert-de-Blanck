import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Clock,
  Calendar,
  Users,
  GraduationCap,
  DollarSign,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Workshop } from "@/types";

// Schema de validación para el formulario
const enrollmentSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(8, "Teléfono inválido").max(20),
  experience: z.string().min(10, "Por favor describe tu experiencia (mínimo 10 caracteres)").max(500),
  motivation: z.string().min(10, "Por favor comparte tu motivación (mínimo 10 caracteres)").max(500),
});

const Talleres = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("Todos");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    motivation: "",
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkshops(data || []);
    } catch (error) {
      console.error("Error cargando talleres:", error);
      toast.error("No se pudieron cargar los talleres disponibles");
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkshops = workshops.filter((workshop) => {
    if (selectedLevel === "Todos") return true;
    return workshop.level === selectedLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Principiante": return "bg-primary/20 text-primary";
      case "Intermedio": return "bg-secondary/20 text-secondary";
      case "Avanzado": return "bg-theater-copper/20 text-theater-copper";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      enrollmentSchema.parse(formData);
      
      if (selectedWorkshop) {
        // AQUÍ: En el futuro conectarías esto con una tabla 'enrollments' en Supabase
        // Por ahora simulamos el éxito
        toast.success("¡Solicitud enviada!", {
          description: `Has solicitado plaza en "${selectedWorkshop.title}". Te contactaremos al ${formData.phone} para finalizar la matrícula.`,
        });
        
        setSelectedWorkshop(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          experience: "",
          motivation: "",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error("Error en el formulario", {
          description: firstError.message,
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-theater-darker via-background to-background z-0" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-primary opacity-10 skew-x-12 transform -translate-x-1/4" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <p className="font-outfit text-sm font-medium text-primary mb-4 tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Formación Teatral
            </p>
            <h1 className="font-playfair text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Talleres y Cursos
            </h1>
            <p className="font-outfit text-xl text-muted-foreground leading-relaxed mb-8">
              Desarrolla tu talento con programas diseñados por profesionales reconocidos. 
              De principiante a avanzado, encuentra el camino perfecto para tu crecimiento artístico.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-outfit text-sm font-medium text-foreground">
              Filtrar por nivel:
            </span>
            <div className="flex flex-wrap gap-2">
              {["Todos", "Principiante", "Intermedio", "Avanzado"].map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className="font-outfit"
                >
                  {level}
                </Button>
              ))}
            </div>
            <Badge variant="outline" className="ml-auto font-outfit">
              {loading ? "..." : filteredWorkshops.length} taller(es)
            </Badge>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[500px] rounded-lg border border-border bg-card p-0 overflow-hidden flex flex-col">
                  <Skeleton className="w-full h-[250px]" />
                  <div className="p-6 space-y-4 flex-1">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-lg">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-playfair text-xl text-foreground">No hay talleres disponibles</h3>
              <p className="text-muted-foreground">No se encontraron talleres con el filtro seleccionado.</p>
              <Button 
                variant="link" 
                onClick={() => setSelectedLevel("Todos")}
                className="mt-2"
              >
                Ver todos los talleres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredWorkshops.map((workshop) => (
                <Card key={workshop.id} className="bg-card border-border overflow-hidden hover:border-primary transition-colors group flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={workshop.image || "/placeholder.svg"}
                      alt={workshop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={getLevelColor(workshop.level)}>
                        {workshop.level}
                      </Badge>
                      {/* Lógica de estado del cupo */}
                      {workshop.enrolled >= workshop.max_students ? (
                        <Badge variant="destructive" className="font-outfit">
                          Cupo Lleno
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-outfit">
                          {workshop.enrolled}/{workshop.max_students} inscritos
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="font-playfair text-2xl group-hover:text-primary transition-colors">
                      {workshop.title}
                    </CardTitle>
                    <p className="font-outfit text-muted-foreground line-clamp-2">
                      {workshop.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm font-outfit">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="truncate">{workshop.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-outfit">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="truncate">{workshop.duration || "Por definir"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-outfit">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="truncate">{workshop.schedule || "Por definir"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-outfit">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Máx. {workshop.max_students}</span>
                      </div>
                    </div>

                    {workshop.features && workshop.features.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <h4 className="font-outfit text-sm font-semibold text-foreground mb-2">
                          Lo que aprenderás:
                        </h4>
                        <ul className="space-y-1">
                          {workshop.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm font-outfit text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div>
                        <p className="font-outfit text-xs text-muted-foreground">Matrícula</p>
                        <p className="font-playfair text-3xl font-bold text-foreground">
                          ${workshop.price}
                        </p>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit"
                            onClick={() => setSelectedWorkshop(workshop)}
                            disabled={workshop.enrolled >= workshop.max_students}
                          >
                            {workshop.enrolled >= workshop.max_students ? "Lista de Espera" : "Inscribirse"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-playfair text-3xl">
                              {workshop.title}
                            </DialogTitle>
                            <DialogDescription className="font-outfit text-base">
                              Completa el formulario para inscribirte
                            </DialogDescription>
                          </DialogHeader>

                          {/* Workshop Details in Dialog */}
                          <div className="bg-muted p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm font-outfit">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="font-semibold">{workshop.instructor}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{workshop.instructor_bio}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm font-outfit">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="font-semibold">${workshop.price}</p>
                                  <p className="text-xs text-muted-foreground">Pago único</p>
                                </div>
                              </div>
                            </div>
                            <p className="font-outfit text-sm text-muted-foreground">
                              {workshop.long_description || workshop.description}
                            </p>
                          </div>

                          {/* Enrollment Form */}
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name" className="font-outfit">
                                  Nombre completo *
                                </Label>
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={(e) => handleInputChange("name", e.target.value)}
                                  placeholder="Tu nombre"
                                  required
                                  className="font-outfit"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email" className="font-outfit">
                                  Correo electrónico *
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange("email", e.target.value)}
                                  placeholder="tu@email.com"
                                  required
                                  className="font-outfit"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone" className="font-outfit">
                                Teléfono *
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+53 5555 5555"
                                required
                                className="font-outfit"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="experience" className="font-outfit">
                                Experiencia previa en teatro *
                              </Label>
                              <Textarea
                                id="experience"
                                value={formData.experience}
                                onChange={(e) => handleInputChange("experience", e.target.value)}
                                placeholder="Cuéntanos sobre tu experiencia..."
                                required
                                className="font-outfit min-h-[100px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="motivation" className="font-outfit">
                                ¿Por qué quieres tomar este taller? *
                              </Label>
                              <Textarea
                                id="motivation"
                                value={formData.motivation}
                                onChange={(e) => handleInputChange("motivation", e.target.value)}
                                placeholder="Comparte tus objetivos..."
                                required
                                className="font-outfit min-h-[100px]"
                              />
                            </div>

                            <Button
                              type="submit"
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-outfit"
                            >
                              Confirmar solicitud de plaza
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-theater-darker py-12 border-t border-border">
        <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground font-outfit text-sm">
                &copy; 2024 Compañía Hubert de Blanck. Todos los derechos reservados.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Talleres;