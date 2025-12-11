import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Play, BlogPost } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// --- IMÁGENES FIJAS (IMPORTS) ---
import theaterInterior from "@/assets/theater-interior.jpg";
import eventMusical from "@/assets/event-musical.jpg"; 
import eventContemporary from "@/assets/event-contemporary.jpg";
import historyImg1 from "@/assets/history-1.jpg"; 
import historyImg2 from "@/assets/history-2.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<Play[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos estáticos para la sección de historia
  const historyMilestones = [
    {
      year: "1955",
      title: "La Sala Original",
      description: "Se inaugura la sala Hubert de Blanck, convirtiéndose rápidamente en un epicentro cultural del Vedado gracias a su acústica privilegiada.",
      image: historyImg1,
    },
    {
      year: "1991",
      title: "Nace la Compañía",
      description: "Bajo la dirección de Orietta Medina y heredando el rigor de Teatro Estudio, se funda oficialmente la compañía que hoy conocemos.",
      image: historyImg2,
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar Obras en Cartelera
        const { data: playsData } = await supabase
          .from("plays")
          .select("*")
          .eq("status", "cartelera")
          .order("date", { ascending: true })
          .limit(3);
        
        if (playsData) setUpcomingEvents(playsData);

        // 2. Cargar Blog
        const { data: blogData } = await supabase
          .from("blog_posts")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(3);

        if (blogData) setRecentPosts((blogData as any) as BlogPost[]);

      } catch (error) {
        console.error("Error cargando datos del inicio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Hero se mantiene porque es contenido específico de la Home */}
      <Hero />

      {/* 1. SECCIÓN CARTELERA */}
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

      {/* 2. SECCIÓN LA COMPAÑÍA */}
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
              <img
                src={theaterInterior}
                alt="Teatro Hubert de Blanck"
                className="rounded-lg w-full h-[500px] object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN BLOG */}
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

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               {[1, 2, 3].map((i) => (
                 <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {recentPosts.length > 0 ? (
                recentPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    onClick={() => navigate(`/blog/${post.id}`)}
                    className="cursor-pointer h-full group"
                  >
                    <BlogCard 
                      title={post.title}
                      excerpt={post.excerpt}
                      image={post.image || (index % 2 === 0 ? eventContemporary : eventMusical)} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground font-outfit">
                    Próximamente publicaremos nuevos artículos y noticias.
                  </p>
                </div>
              )}
            </div>
          )}

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

      {/* 4. SECCIÓN HISTORIA */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
                <p className="font-outfit text-sm font-medium text-primary mb-2 tracking-widest uppercase">
                    Nuestro Legado
                </p>
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Historia Viva
                </h2>
                <p className="text-muted-foreground font-outfit">
                    Desde los años 50 hasta la actualidad, un escenario testigo de la cultura cubana.
                </p>
            </div>
            <Link to="/historia">
                <Button variant="ghost" className="hidden md:flex font-outfit hover:text-primary">
                    Leer historia completa <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {historyMilestones.map((item, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:shadow-xl transition-all duration-500">
                    <div className="aspect-video overflow-hidden">
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                        />
                    </div>
                    <div className="p-8">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4 font-outfit">
                            {item.year}
                        </span>
                        <h3 className="font-playfair text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-muted-foreground font-outfit leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
             <Link to="/historia">
                <Button variant="outline" className="w-full font-outfit">
                    Leer historia completa
                </Button>
            </Link>
        </div>
      </section>
    </>
  );
};

export default Index;