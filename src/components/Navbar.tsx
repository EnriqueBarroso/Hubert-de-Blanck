import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Theater, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-theater-darker/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="font-playfair text-2xl font-bold tracking-wide">
              <span className="text-primary">Hubert</span>
              <span className="text-foreground"> de </span>
              <span className="text-secondary">Blanck</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Inicio
            </Link>
            <Link to="/cartelera" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Cartelera
            </Link>
            <Link to="/compania" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              La Compañía
            </Link>
            <Link to="/producciones" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Producciones
            </Link>
            <Link to="/elenco" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Elenco
            </Link>
            <Link to="/talleres" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Talleres
            </Link>
            <Link to="/blog" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Blog
            </Link>
            <Link to="/contacto" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Contacto
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <Theater className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                Inicio
              </Link>
              <Link to="/cartelera" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                Cartelera
              </Link>
              <Link to="/compania" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                La Compañía
              </Link>
              <Link to="/producciones" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                Producciones
              </Link>
              <Link to="/elenco" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                Elenco
              </Link>
              <Link to="/talleres" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                Talleres
              </Link>
              <Link to="/blog" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                Blog
              </Link>
              <Link to="/contacto" className="font-outfit text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
