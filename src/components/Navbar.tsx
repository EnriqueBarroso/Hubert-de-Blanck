import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Theater, User, Menu, X, ShieldCheck, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);

    if (session) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      setIsAdmin(!!roles);
    } else {
      setIsAdmin(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-theater-darker/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <div className="font-playfair text-xl md:text-2xl font-bold tracking-wide">
              <span className="text-primary">Hubert</span>
              <span className="text-foreground"> de </span>
              <span className="text-secondary">Blanck</span>
            </div>
          </Link>

          {/* Desktop Menu - SIN ENLACE A GALERÍA */}
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {!isAuthenticated ? (
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Panel Admin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
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
          <div className="md:hidden pt-4 pb-4 animate-fade-in border-t border-border/50 mt-4">
            <div className="flex flex-col gap-1">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="font-outfit text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors uppercase tracking-wide py-3 px-2 rounded-lg"
              >
                Inicio
              </Link>
              <Link 
                to="/cartelera" 
                onClick={closeMobileMenu}
                className="font-outfit text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors uppercase tracking-wide py-3 px-2 rounded-lg"
              >
                Cartelera
              </Link>
              <Link 
                to="/compania" 
                onClick={closeMobileMenu}
                className="font-outfit text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors uppercase tracking-wide py-3 px-2 rounded-lg"
              >
                La Compañía
              </Link>
              <Link 
                to="/talleres" 
                onClick={closeMobileMenu}
                className="font-outfit text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors uppercase tracking-wide py-3 px-2 rounded-lg"
              >
                Talleres
              </Link>
              <Link 
                to="/blog" 
                onClick={closeMobileMenu}
                className="font-outfit text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors uppercase tracking-wide py-3 px-2 rounded-lg"
              >
                Blog
              </Link>
              <Link 
                to="/contacto" 
                onClick={closeMobileMenu}
                className="font-outfit text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors uppercase tracking-wide py-3 px-2 rounded-lg"
              >
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