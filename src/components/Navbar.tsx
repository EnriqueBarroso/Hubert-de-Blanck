import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Headphones, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? "bg-venue-darker/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold tracking-wider">
              <span className="text-foreground">MAR</span>
              <span className="text-primary">ULA</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Inicio
            </Link>
            <Link to="/agenda" className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Agenda
            </Link>
            <Link to="/la-sala" className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              La Sala
            </Link>
            <Link to="/info" className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Info
            </Link>
            <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Blog
            </Link>
            <Link to="/contacto" className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
              Contacto
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <Headphones className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
