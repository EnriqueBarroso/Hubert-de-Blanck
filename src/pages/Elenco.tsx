import Navbar from "@/components/Navbar";
import { actors } from "@/data/actors";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Elenco = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
            Nuestro Elenco
          </h1>
          <p className="font-outfit text-xl text-muted-foreground max-w-2xl mx-auto">
            Conoce a los talentosos artistas que dan vida a nuestras producciones
          </p>
        </div>
      </section>

      {/* Actors Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actors.map((actor) => (
              <article 
                key={actor.id}
                className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={actor.image}
                    alt={actor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {actor.name}
                  </h3>
                  <p className="font-outfit text-sm text-secondary uppercase tracking-wider mb-3">
                    {actor.role}
                  </p>
                  <p className="font-outfit text-sm text-muted-foreground line-clamp-3 mb-4">
                    {actor.bio}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Ver biografía completa
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Quieres formar parte del elenco?
          </h2>
          <p className="font-outfit text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Estamos siempre en búsqueda de nuevos talentos. Si te apasiona el teatro y crees que puedes aportar a nuestra compañía, nos encantaría conocerte.
          </p>
          <Button size="lg" className="font-outfit">
            <Mail className="mr-2 h-5 w-5" />
            Contáctanos
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-playfair text-xl font-bold text-foreground mb-4">Compañía Hubert de Blanck</h3>
              <p className="font-outfit text-sm text-muted-foreground">Teatro contemporáneo y vanguardista</p>
            </div>
            <div>
              <h4 className="font-outfit font-bold text-foreground mb-4">Navegación</h4>
              <ul className="space-y-2 font-outfit text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</a></li>
                <li><a href="/cartelera" className="text-muted-foreground hover:text-primary transition-colors">Cartelera</a></li>
                <li><a href="/compania" className="text-muted-foreground hover:text-primary transition-colors">Compañía</a></li>
                <li><a href="/elenco" className="text-muted-foreground hover:text-primary transition-colors">Elenco</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-outfit font-bold text-foreground mb-4">Contacto</h4>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li>Calle Calzada, 111</li>
                <li>10400, Vedado, Cuba</li>
                <li>+53 78 30 10 11</li>
                <li>info@hubertdeblanck.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-outfit font-bold text-foreground mb-4">Síguenos</h4>
              <p className="font-outfit text-sm text-muted-foreground">
                Mantente al día con nuestras últimas producciones y novedades
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="font-outfit text-sm text-muted-foreground">
              © 2024 Compañía Hubert de Blanck. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Elenco;
