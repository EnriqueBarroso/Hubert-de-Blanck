import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, ArrowRight, Tag } from "lucide-react";

import blogInterview from "@/assets/blog-interview.jpg";
import blogTechnique from "@/assets/blog-technique.jpg";
import blogHistory from "@/assets/blog-history.jpg";
import eventContemporary from "@/assets/event-contemporary.jpg";
import eventMusical from "@/assets/event-musical.jpg";
import theaterInterior from "@/assets/theater-interior.jpg";

type Category = "Todos" | "Entrevistas" | "Técnicas" | "Historia" | "Reseñas" | "Cultura";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const posts: BlogPost[] = [
    {
      id: "1",
      title: "Ana Martínez: 'El teatro debe incomodar para transformar'",
      excerpt: "Conversamos con nuestra directora artística sobre su visión del teatro contemporáneo, los desafíos de montar obras vanguardistas y el futuro de las artes escénicas en Cuba.",
      content: "En esta entrevista exclusiva, Ana Martínez comparte sus reflexiones sobre más de dos décadas dedicadas al teatro...",
      category: "Entrevistas",
      author: "Carlos Mendoza",
      date: "15 Nov 2024",
      readTime: "8 min",
      image: blogInterview,
      tags: ["Directora", "Visión artística", "Teatro contemporáneo"],
    },
    {
      id: "2",
      title: "El Método Stanislavski: Guía para principiantes",
      excerpt: "Descubre los fundamentos del revolucionario método que cambió para siempre la forma de entender la actuación. Una introducción práctica con ejercicios que puedes comenzar hoy.",
      content: "Konstantin Stanislavski desarrolló un sistema que busca la verdad psicológica del personaje...",
      category: "Técnicas",
      author: "Luis Fernández",
      date: "10 Nov 2024",
      readTime: "12 min",
      image: blogTechnique,
      tags: ["Actuación", "Método", "Formación"],
    },
    {
      id: "3",
      title: "70 años de historia: El legado de Hubert de Blanck",
      excerpt: "Un recorrido por las siete décadas que han consolidado a nuestra compañía como referente del teatro cubano. Desde los inicios en 1955 hasta la era digital.",
      content: "La Compañía Hubert de Blanck nació en un momento crucial para la cultura cubana...",
      category: "Historia",
      author: "María González",
      date: "5 Nov 2024",
      readTime: "15 min",
      image: blogHistory,
      tags: ["Aniversario", "Trayectoria", "Cultura cubana"],
    },
    {
      id: "4",
      title: "'La Casa de Bernarda Alba': Una obra que sigue vigente",
      excerpt: "Análisis de nuestro reciente montaje de la obra maestra de García Lorca. Por qué esta historia de opresión y libertad resuena tan fuerte en 2024.",
      content: "La puesta en escena contemporánea de esta obra clásica demuestra que los temas de Lorca son atemporales...",
      category: "Reseñas",
      author: "Ana Martínez",
      date: "1 Nov 2024",
      readTime: "10 min",
      image: eventContemporary,
      tags: ["García Lorca", "Producción", "Crítica"],
    },
    {
      id: "5",
      title: "5 ejercicios de calentamiento vocal que todo actor debe conocer",
      excerpt: "La voz es el instrumento más importante del actor. Aprende estas técnicas esenciales para cuidar y potenciar tu instrumento vocal antes de cada función.",
      content: "El calentamiento vocal no es opcional, es fundamental para la salud de tus cuerdas vocales...",
      category: "Técnicas",
      author: "Luis Fernández",
      date: "28 Oct 2024",
      readTime: "6 min",
      image: blogTechnique,
      tags: ["Voz", "Ejercicios", "Salud vocal"],
    },
    {
      id: "6",
      title: "El musical en América Latina: Pasado, presente y futuro",
      excerpt: "El teatro musical está viviendo un renacimiento en nuestra región. Exploramos las producciones que están marcando tendencia y hacia dónde nos dirigimos.",
      content: "Después de décadas de predominio de producciones extranjeras, los musicales latinoamericanos están tomando protagonismo...",
      category: "Cultura",
      author: "María González",
      date: "25 Oct 2024",
      readTime: "11 min",
      image: eventMusical,
      tags: ["Musical", "Tendencias", "Latinoamérica"],
    },
    {
      id: "7",
      title: "Cómo prepararse para una audición teatral exitosa",
      excerpt: "Consejos prácticos de nuestro equipo de directores para que tu próxima audición sea memorable por las razones correctas. Desde la elección del monólogo hasta la actitud.",
      content: "Las audiciones pueden ser intimidantes, pero con la preparación adecuada puedes brillar...",
      category: "Técnicas",
      author: "Carlos Rodríguez",
      date: "20 Oct 2024",
      readTime: "9 min",
      image: blogTechnique,
      tags: ["Audiciones", "Consejos", "Carrera"],
    },
    {
      id: "8",
      title: "Los espacios teatrales independientes y su rol cultural",
      excerpt: "Por qué los teatros como el nuestro son esenciales para la diversidad cultural y la experimentación artística. Un análisis del ecosistema teatral contemporáneo.",
      content: "Los grandes teatros comerciales tienen su lugar, pero los espacios independientes son laboratorios de innovación...",
      category: "Cultura",
      author: "Ana Martínez",
      date: "15 Oct 2024",
      readTime: "13 min",
      image: theaterInterior,
      tags: ["Espacios culturales", "Independiente", "Reflexión"],
    },
  ];

  const categories: Category[] = ["Todos", "Entrevistas", "Técnicas", "Historia", "Reseñas", "Cultura"];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch = 
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: Category) => {
    const colors: Record<Category, string> = {
      "Todos": "bg-muted text-muted-foreground",
      "Entrevistas": "bg-primary/20 text-primary",
      "Técnicas": "bg-secondary/20 text-secondary",
      "Historia": "bg-theater-copper/20 text-theater-copper",
      "Reseñas": "bg-primary/20 text-primary",
      "Cultura": "bg-secondary/20 text-secondary",
    };
    return colors[category] || colors["Todos"];
  };

  const featuredPost = posts[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-theater-darker via-background to-background z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-10 -skew-x-12 transform translate-x-1/4" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="font-playfair text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Blog
            </h1>
            <p className="font-outfit text-xl text-muted-foreground leading-relaxed mb-8">
              Reflexiones, entrevistas y análisis sobre el arte teatral contemporáneo. 
              Historias desde el escenario contadas por quienes hacen teatro.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-outfit"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-theater-darker sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-outfit text-sm font-medium text-foreground">
              Categorías:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="font-outfit"
                >
                  {category}
                </Button>
              ))}
            </div>
            <Badge variant="outline" className="ml-auto font-outfit">
              {filteredPosts.length} artículo(s)
            </Badge>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {selectedCategory === "Todos" && searchQuery === "" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-8">
              Artículo destacado
            </h2>
            <Card className="bg-card border-border overflow-hidden hover:border-primary transition-colors group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative aspect-video lg:aspect-square overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(featuredPost.category)}>
                      {featuredPost.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-sm font-outfit text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>

                    <h3 className="font-playfair text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h3>

                    <p className="font-outfit text-muted-foreground leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="font-outfit">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit w-fit">
                    Leer artículo completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {selectedCategory !== "Todos" || searchQuery !== "" ? (
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-8">
              {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory}
            </h2>
          ) : (
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-8">
              Todos los artículos
            </h2>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="font-outfit text-muted-foreground">
                No se encontraron artículos que coincidan con tu búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(selectedCategory === "Todos" && searchQuery === "" ? 1 : 0).map((post) => (
                <Card
                  key={post.id}
                  className="bg-card border-border overflow-hidden hover:border-primary transition-colors group cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-center gap-3 text-xs font-outfit text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="font-playfair text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>

                  <CardContent>
                    <p className="font-outfit text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-outfit text-sm text-muted-foreground">
                          {post.author}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="font-outfit group-hover:text-primary">
                        Leer más
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
              No te pierdas ningún artículo
            </h2>
            <p className="font-outfit text-lg text-muted-foreground mb-8">
              Suscríbete a nuestro newsletter y recibe contenido exclusivo sobre teatro, 
              entrevistas con artistas y actualizaciones de nuestras producciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="tu@email.com"
                className="font-outfit flex-1"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit">
                Suscribirse
              </Button>
            </div>
            <p className="font-outfit text-xs text-muted-foreground mt-4">
              No spam. Solo contenido de calidad una vez por semana.
            </p>
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

export default Blog;
