import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Play, GalleryItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// Mantenemos la imagen estática solo como respaldo (fallback) por si la BD está vacía
import theaterInterior from "@/assets/theater-interior.jpg";
import eventMusical from "@/assets/event-musical.jpg";
import eventContemporary from "@/assets/event-contemporary.jpg";

const Index = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Play[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mantenemos tus títulos de blog que te gustan, pero haremos las imágenes dinámicas
  const blogPostsStructure = [
    {
      title: "El teatro como herramienta de transformación social en tiempos modernos",
      excerpt: "Exploramos cómo el teatro contemporáneo refleja y transforma nuestra realidad",
      fallbackImage: eventContemporary, // Imagen por defecto si no hay en galería
    },
    {
      title: "Detrás del telón: El proceso creativo de nuestras producciones musicales",
      excerpt: "Un vistazo íntimo al trabajo que hay detrás de cada montaje",
      fallbackImage: eventMusical,
    },
    {
      title: "La importancia de los espacios teatrales independientes en la cultura actual",
      excerpt: "Por qué los teatros como el nuestro son esenciales para la diversidad cultural",
      fallbackImage: theaterInterior,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar Obras en Cartelera (Máximo 3)
        const { data: playsData } = await supabase
          .from("plays")
          .select("*")
          .eq("status", "cartelera")
          .order("date", { ascending: true }) // Ordenar por fecha (texto) por ahora
          .limit(3);
        
        if (playsData) setUpcomingEvents(playsData);

        // 2. Cargar Imágenes de la Galería para usarlas en las secciones
        // Traemos las últimas 5 imágenes subidas para repartirlas en la home
        const { data: galleryData } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (galleryData) setGalleryImages(galleryData);

      } catch (error) {
        console.error("Error cargando datos del inicio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Events Section with Emerald Accent */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary -skew-y-12 transform translate-y-32 opacity-20 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-4">
              Próximas Funciones
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre las experiencias teatrales que están transformando nuestra escena
            </p>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               {[1, 2, 3].map((i) => (
                 <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard 
                    key={event.id}
                    title={event.title}
                    date={event.date || "Fecha por confirmar"}
                    image={event.image || "/placeholder.svg"}
                    category={event.category}
                    // Lógica para asignar el color de la etiqueta según la categoría
                    categoryVariant={
                      event.category.toLowerCase().includes("musical") ? "musical" : 
                      event.category.toLowerCase().includes("taller") ? "workshop" : "contemporary"
                    }
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground font-outfit">
                    No hay funciones programadas en cartelera en este momento.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <Link to="/cartelera">
              <Button 
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-outfit font-bold rounded-full px-8"
              >
                Ver cartelera completa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* La Compañía Section */}
      <section className="relative py-20 bg-theater-darker overflow-hidden">
        <div className="absolute bottom-0 left-0 w-1/2 h-96 bg-secondary -skew-y-12 transform -translate-y-32 opacity-20 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-outfit text-sm font-medium text-primary mb-4 tracking-widest uppercase flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Nuestra Esencia
              </p>
              <h2 className="font-playfair text-6xl font-bold text-foreground mb-6 leading-tight">
                Un espacio para la vanguardia teatral
              </h2>
              <p className="font-outfit text-lg text-muted-foreground mb-6 leading-relaxed">
                Somos más que un teatro. Somos un laboratorio de ideas, un refugio para la creatividad 
                y un puente entre tradición e innovación.
              </p>
              <p className="font-outfit text-lg text-muted-foreground mb-8 leading-relaxed">
                Desde nuestra fundación, hemos creído que el teatro tiene el poder de cuestionar, 
                inspirar y transformar. Cada producción es una invitación a ver el mundo desde nuevas perspectivas.
              </p>
              <Link to="/compania">
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-outfit"
                >
                  Conoce nuestra historia
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 lg:block hidden" />
              {/* Usamos la primera imagen de la galería, o el fallback si no hay */}
              <img
                src={galleryImages.length > 0 ? galleryImages[0].image_url : theaterInterior}
                alt="Teatro Hubert de Blanck"
                className="rounded-lg w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section with Copper Accent */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-96 bg-theater-copper -skew-y-12 transform translate-y-32 opacity-20 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
              Reflexiones desde el escenario
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl">
              Pensamientos, entrevistas y crónicas sobre el arte teatral contemporáneo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {blogPostsStructure.map((post, index) => {
              // Intentamos usar imágenes de la galería (saltando la primera que usamos en Compañía)
              // Si no hay suficientes imágenes en la galería, usamos la imagen fallback original
              const dynamicImage = galleryImages.length > (index + 1) 
                ? galleryImages[index + 1].image_url 
                : post.fallbackImage;

              return (
                <BlogCard 
                  key={index} 
                  title={post.title}
                  excerpt={post.excerpt}
                  image={dynamicImage}
                />
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/blog">
              <Button 
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-outfit font-bold rounded-full px-8"
              >
                Leer más artículos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
                <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                <li><Link to="/cartelera" className="hover:text-primary transition-colors">Cartelera</Link></li>
                <li><Link to="/compania" className="hover:text-primary transition-colors">La Compañía</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
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

export default Index;