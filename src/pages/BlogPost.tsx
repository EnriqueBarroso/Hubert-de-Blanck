import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { BlogPost as BlogPostType } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        setLoading(true);
        
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPost((data as any) as BlogPostType);

      } catch (error) {
        console.error("Error cargando artículo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 max-w-4xl space-y-8">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center space-y-4">
            <h1 className="text-3xl font-playfair font-bold">Artículo no encontrado</h1>
            <Link to="/blog">
                <Button>Volver al Blog</Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header / Hero del Artículo */}
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
            {/* Navegación y Metadatos */}
            <div className="mb-8 animate-fade-in">
                <Link to="/blog">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-6 font-outfit">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Blog
                    </Button>
                </Link>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-outfit mb-4">
                    {post.category && (
                        <span className="flex items-center gap-1 text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                            <Tag className="h-3 w-3" />
                            {post.category}
                        </span>
                    )}
                    {post.published_at && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author || "Redacción"}
                    </span>
                </div>

                <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                    {post.title}
                </h1>
                
                <p className="font-outfit text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
                    {post.excerpt}
                </p>
            </div>

            {/* Imagen Principal */}
            {post.image && (
                <div className="rounded-xl overflow-hidden mb-12 shadow-2xl aspect-video animate-fade-in">
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Contenido del Artículo */}
            <div className="prose prose-lg dark:prose-invert max-w-none font-outfit text-foreground/90 leading-loose animate-fade-in">
                {/* Renderizamos el texto respetando los saltos de línea */}
                {post.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() === "" ? <br key={index} /> : <p key={index} className="mb-4">{paragraph}</p>
                ))}
            </div>
            
            {/* Footer del Artículo */}
            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                <p className="font-outfit text-muted-foreground italic">
                    Compartir este artículo
                </p>
                {/* Aquí podrías poner botones de redes sociales si quisieras */}
            </div>
        </div>
      </article>

      {/* Footer General */}
      <footer className="bg-theater-darker py-8 border-t border-border mt-auto text-center">
        <p className="font-outfit text-sm text-muted-foreground">© 2024 Compañía Hubert de Blanck.</p>
      </footer>
    </div>
  );
};

export default BlogPost;