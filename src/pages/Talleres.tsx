import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import workshopActing from "@/assets/workshop-acting.jpg";
import workshopMusical from "@/assets/workshop-musical.jpg";
import workshopVoice from "@/assets/workshop-voice.jpg";

type Level = "Principiante" | "Intermedio" | "Avanzado";

interface Workshop {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  instructorBio: string;
  level: Level;
  duration: string;
  schedule: string;
  maxStudents: number;
  enrolled: number;
  price: number;
  image: string;
  features: string[];
}

const enrollmentSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(8, "Teléfono inválido").max(20),
  experience: z.string().min(10, "Por favor describe tu experiencia (mínimo 10 caracteres)").max(500),
  motivation: z.string().min(10, "Por favor comparte tu motivación (mínimo 10 caracteres)").max(500),
});

const Talleres = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>("Todos");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    motivation: "",
  });

  const workshops: Workshop[] = [
    {
      id: "1",
      title: "Actuación Método Stanislavski",
      description: "Domina las técnicas fundamentales del método Stanislavski y desarrolla tu verdad escénica.",
      longDescription: "Un taller intensivo que explora el revolucionario método de Konstantin Stanislavski. Aprenderás a construir personajes auténticos a través de la memoria emocional, el análisis activo y la improvisación. Ideal para quienes buscan profundizar en la verdad psicológica del personaje.",
      instructor: "Ana Martínez",
      instructorBio: "Directora Artística con 20 años de experiencia. Formada en el Studio de Actores de Moscú.",
      level: "Intermedio",
      duration: "12 semanas",
      schedule: "Sábados 10:00 - 14:00",
      maxStudents: 15,
      enrolled: 8,
      price: 450,
      image: workshopActing,
      features: [
        "Ejercicios de memoria emocional",
        "Análisis de texto dramático",
        "Improvisación y juego escénico",
        "Montaje de escenas finales",
        "Certificado de participación",
      ],
    },
    {
      id: "2",
      title: "Teatro Musical - Canto y Actuación",
      description: "Integra canto, actuación y movimiento para dominar el arte del teatro musical.",
      longDescription: "Programa completo que fusiona las tres disciplinas esenciales del teatro musical. Trabajarás repertorio clásico y contemporáneo de Broadway, desarrollando técnica vocal, interpretación de canciones y presencia escénica. Incluye masterclasses con artistas invitados.",
      instructor: "María González",
      instructorBio: "Coreógrafa Principal. Especialista en teatro musical formada en Broadway y el West End.",
      level: "Principiante",
      duration: "16 semanas",
      schedule: "Martes y Jueves 18:00 - 20:00",
      maxStudents: 20,
      enrolled: 12,
      price: 580,
      image: workshopMusical,
      features: [
        "Técnica vocal para teatro musical",
        "Interpretación de canciones narrativas",
        "Coreografía y movimiento escénico",
        "Repertorio de Broadway",
        "Presentación final con público",
      ],
    },
    {
      id: "3",
      title: "Voz y Dicción Teatral",
      description: "Desarrolla potencia vocal, claridad articulatoria y expresividad para el escenario.",
      longDescription: "Taller especializado en técnica vocal aplicada al teatro. Aprenderás respiración diafragmática, proyección vocal, articulación clara y uso expresivo de la voz. Incluye ejercicios de calentamiento vocal y trabajo con textos clásicos y contemporáneos.",
      instructor: "Luis Fernández",
      instructorBio: "Director Pedagógico. Especialista en voz con metodología Linklater y Fitzmaurice.",
      level: "Principiante",
      duration: "8 semanas",
      schedule: "Miércoles 17:00 - 19:00",
      maxStudents: 12,
      enrolled: 5,
      price: 320,
      image: workshopVoice,
      features: [
        "Técnicas de respiración",
        "Proyección y resonancia vocal",
        "Articulación y dicción",
        "Expresividad vocal",
        "Grabaciones para análisis",
      ],
    },
    {
      id: "4",
      title: "Dramaturgia Contemporánea",
      description: "Crea tus propios textos teatrales explorando narrativas contemporáneas.",
      longDescription: "Taller de escritura dramática que explora técnicas de construcción narrativa, desarrollo de personajes y diálogo teatral. Analizarás obras contemporáneas y desarrollarás tu propia obra corta bajo la guía de dramaturgos profesionales.",
      instructor: "Carlos Rodríguez",
      instructorBio: "Director de Producción. Dramaturgo galardonado con 15 obras estrenadas internacionalmente.",
      level: "Avanzado",
      duration: "10 semanas",
      schedule: "Viernes 19:00 - 21:00",
      maxStudents: 10,
      enrolled: 6,
      price: 380,
      image: workshopActing,
      features: [
        "Estructura dramática",
        "Desarrollo de personajes",
        "Diálogo teatral",
        "Análisis de obras contemporáneas",
        "Lectura dramatizada de textos finales",
      ],
    },
  ];

  const filteredWorkshops = workshops.filter((workshop) => {
    if (selectedLevel === "Todos") return true;
    return workshop.level === selectedLevel;
  });

  const getLevelColor = (level: Level) => {
    switch (level) {
      case "Principiante":
        return "bg-primary/20 text-primary";
      case "Intermedio":
        return "bg-secondary/20 text-secondary";
      case "Avanzado":
        return "bg-theater-copper/20 text-theater-copper";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      enrollmentSchema.parse(formData);
      
      if (selectedWorkshop) {
        toast.success("¡Inscripción enviada!", {
          description: `Te has inscrito en ${selectedWorkshop.title}. Te contactaremos pronto para confirmar tu matrícula.`,
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
              {filteredWorkshops.length} taller(es)
            </Badge>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="bg-card border-border overflow-hidden hover:border-primary transition-colors group">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getLevelColor(workshop.level as Level)}>
                      {workshop.level}
                    </Badge>
                    <Badge variant="secondary" className="font-outfit">
                      {workshop.enrolled}/{workshop.maxStudents} inscritos
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="font-playfair text-2xl group-hover:text-primary transition-colors">
                    {workshop.title}
                  </CardTitle>
                  <p className="font-outfit text-muted-foreground">
                    {workshop.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm font-outfit">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>{workshop.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-outfit">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-outfit">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{workshop.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-outfit">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Máx. {workshop.maxStudents} estudiantes</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-outfit text-sm font-semibold text-foreground mb-2">
                      Lo que aprenderás:
                    </h4>
                    <ul className="space-y-1">
                      {workshop.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm font-outfit text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
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
                          disabled={workshop.enrolled >= workshop.maxStudents}
                        >
                          {workshop.enrolled >= workshop.maxStudents ? "Completo" : "Inscribirse"}
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

                        {/* Workshop Details */}
                        <div className="bg-muted p-4 rounded-lg space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm font-outfit">
                              <GraduationCap className="h-4 w-4 text-primary" />
                              <div>
                                <p className="font-semibold">{workshop.instructor}</p>
                                <p className="text-xs text-muted-foreground">{workshop.instructorBio}</p>
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
                            {workshop.longDescription}
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
                              placeholder="Cuéntanos sobre tu experiencia en teatro, actuación o artes escénicas..."
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
                              placeholder="Comparte tus objetivos y motivación para unirte a este taller..."
                              required
                              className="font-outfit min-h-[100px]"
                            />
                          </div>

                          <div className="bg-primary/10 p-4 rounded-lg">
                            <h4 className="font-outfit font-semibold text-foreground mb-2">
                              Resumen de inscripción
                            </h4>
                            <div className="space-y-1 text-sm font-outfit">
                              <div className="flex justify-between">
                                <span>Taller:</span>
                                <span className="font-semibold">{workshop.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Duración:</span>
                                <span>{workshop.duration}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Horario:</span>
                                <span>{workshop.schedule}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-border">
                                <span className="font-semibold">Total a pagar:</span>
                                <span className="font-bold text-lg">${workshop.price}</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-outfit"
                          >
                            Confirmar inscripción
                          </Button>

                          <p className="text-xs text-muted-foreground text-center font-outfit">
                            Al inscribirte, aceptas nuestros términos y condiciones. 
                            Te contactaremos para coordinar el pago y confirmar tu plaza.
                          </p>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
              ¿Por qué elegir nuestros talleres?
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Formación de excelencia con profesionales reconocidos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                  Profesores Expertos
                </h3>
                <p className="font-outfit text-sm text-muted-foreground">
                  Aprende de artistas activos con trayectoria internacional y metodologías probadas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                  Grupos Reducidos
                </h3>
                <p className="font-outfit text-sm text-muted-foreground">
                  Máximo 20 estudiantes por taller para garantizar atención personalizada
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-theater-copper/20 flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="h-8 w-8 text-theater-copper" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                  Certificación
                </h3>
                <p className="font-outfit text-sm text-muted-foreground">
                  Certificado oficial al completar el programa avalado por nuestra compañía
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-theater-darker py-12 border-t border-border">
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
                <li><a href="/talleres" className="hover:text-primary transition-colors">Talleres</a></li>
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

export default Talleres;
