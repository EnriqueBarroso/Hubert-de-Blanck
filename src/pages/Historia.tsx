import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem, BlogPost } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Building, User, Calendar } from "lucide-react";
import historyHeader from "@/assets/history-1.jpg"; 

const Historia = () => {
  const [historicalPhotos, setHistoricalPhotos] = useState<GalleryItem[]>([]);
  const [historicalPosts, setHistoricalPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: galleryData } = await supabase
          .from("gallery")
          .select("*")
          .eq("category", "Historia")
          .order("created_at", { ascending: true })
          .limit(12);
        
        if (galleryData) setHistoricalPhotos(galleryData);

        const { data: blogData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("category", "Historia")
          .order("published_at", { ascending: false });

        if (blogData) setHistoricalPosts((blogData as any) as BlogPost[]);

      } catch (error) {
        console.error("Error cargando historia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background text-foreground font-outfit">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={historyHeader} 
          alt="Archivo Histórico" 
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <p className="text-primary font-bold tracking-widest uppercase mb-4">Desde 1955</p>
          <h1 className="font-playfair text-5xl md:text-7xl text-white font-bold mb-6">
            Nuestra Historia
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            "Un pueblo sin teatro es un pueblo sin verdad."
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold mb-6">Los Cimientos</h2>
          <p className="text-lg text-muted-foreground text-justify">
            La historia de nuestra compañía está indisolublemente ligada a figuras titánicas de la cultura cubana. 
            Todo comenzó con el sueño de <strong>Hubert de Blanck</strong>, músico y pedagogo holandés que hizo de Cuba su patria, 
            y cuya herencia fue recogida por <strong>Olga Boa</strong> y las generaciones fundadoras de <strong>Teatro Estudio</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
            <img 
              src={historicalPhotos[0]?.image_url || "/placeholder.svg"} 
              alt="Fundadores" 
              className="w-full h-full object-cover sepia"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
              <p className="font-playfair text-lg">Los Inicios</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="font-playfair text-3xl font-bold flex items-center gap-3">
              <User className="text-primary h-6 w-6" />
              Figuras Legendarias
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              En 1991, tras décadas de trabajo bajo el sello de Teatro Estudio, se consolida la 
              <strong> Compañía Teatral Hubert de Blanck</strong>. Bajo la guía de directores que priorizaron 
              la investigación escénica y el rigor actoral, la compañía se estableció como un laboratorio 
              permanente de creación.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nombres como <strong>Berta Martínez</strong> y <strong>Abelardo Estorino</strong> han dejado 
              su huella en nuestras tablas, dirigiendo puestas en escena que hoy se consideran clásicos 
              del teatro cubano contemporáneo.
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-8 opacity-50" />

      <section className="py-20 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <h2 className="font-playfair text-4xl font-bold flex items-center gap-3">
                <Building className="text-primary h-8 w-8" />
                La Sala Hubert de Blanck
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Ubicada en el corazón del Vedado, nuestra sede es mucho más que un edificio; es un templo 
                  de la cultura. Inaugurada en <strong>1955</strong>, la sala fue diseñada con una acústica 
                  privilegiada, pensada originalmente para música de cámara, lo que otorga a nuestras obras 
                  una sonoridad íntima y única.
                </p>
                <p>
                  Tras su restauración en 2010, el teatro cuenta con capacidad para <strong>260 espectadores</strong>, 
                  manteniendo su arquitectura original pero integrando tecnología moderna de iluminación y sonido.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Card className="bg-background/50 border-none">
                  <CardContent className="p-4 text-center">
                    <p className="font-playfair text-3xl font-bold text-primary">260</p>
                    <p className="text-sm text-muted-foreground">Butacas</p>
                  </CardContent>
                </Card>
                <Card className="bg-background/50 border-none">
                  <CardContent className="p-4 text-center">
                    <p className="font-playfair text-3xl font-bold text-primary">1955</p>
                    <p className="text-sm text-muted-foreground">Año Inaugural</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="order-1 lg:order-2">
               <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border-4 border-background/20">
                 <img 
                   src={historicalPhotos[1]?.image_url || "/placeholder.svg"} 
                   alt="Sala Hubert de Blanck" 
                   className="w-full h-full object-cover"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {historicalPosts.length > 0 && (
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold flex items-center justify-center gap-3">
              <BookOpen className="text-primary h-8 w-8" />
              Relatos y Biografías
            </h2>
            <p className="text-muted-foreground mt-4">
              Profundiza en la vida de nuestros directores y actores destacados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {historicalPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow border-border/50">
                {post.image && (
                  <div className="aspect-[21/9] overflow-hidden rounded-t-lg">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider mb-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.published_at!).getFullYear()}
                  </div>
                  <h3 className="font-playfair text-2xl font-bold mb-3">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold mb-10 text-center">Archivo Visual</h2>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
          ) : (
            <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-background">
              <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {historicalPhotos.map((photo) => (
                  <Dialog key={photo.id}>
                    <DialogTrigger asChild>
                      <div className="break-inside-avoid mb-4 overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                        <img 
                          src={photo.image_url} 
                          alt={photo.title} 
                          className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                        />
                        <p className="text-xs text-center mt-2 text-muted-foreground font-playfair italic">
                          {photo.title}
                        </p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-transparent border-none p-0">
                      <img 
                        src={photo.image_url} 
                        alt={photo.title} 
                        className="w-full h-auto max-h-[85vh] object-contain rounded-md" 
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </section>
    </div>
  );
};

export default Historia;