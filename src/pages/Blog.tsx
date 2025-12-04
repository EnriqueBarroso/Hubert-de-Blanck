import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard"; // Asegúrate de que este componente acepte props
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Noticias", "Críticas", "Entrevistas", "Historia"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts((data as any) as BlogPost[]);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-theater-darker">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
            Blog y Noticias
          </h1>
          <p className="font-outfit text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Mantente al día con las últimas novedades, críticas y entrevistas de la Compañía Hubert de Blanck.
          </p>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar artículos..."
                className="pl-10 h-12 font-outfit text-lg bg-background/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="font-outfit rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No se encontraron artículos con los criterios seleccionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  image={post.image || "/placeholder.svg"}
                  excerpt={post.excerpt}
                  // Pasamos fecha si el componente BlogCard lo soporta, si no, puedes modificar BlogCard
                  // date={new Date(post.published_at).toLocaleDateString()} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-theater-darker py-8 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="font-outfit text-sm text-muted-foreground">
            © 2024 Compañía Hubert de Blanck.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;