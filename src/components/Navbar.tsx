import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, Menu, X, ShieldCheck, LogIn, LogOut } from "lucide-react";
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
  const [isClosing, setIsClosing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Definimos los enlaces aquí para no repetir código
  const navLinks = [
    { to: "/", label: "Inicio", end: true },
    { to: "/cartelera", label: "Cartelera", end: false },
    { to: "/compania", label: "La Compañía", end: false },
    { to: "/talleres", label: "Talleres", end: false },
    { to: "/blog", label: "Blog", end: false },
    { to: "/contacto", label: "Contacto", end: false },
  ];

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (mobileMenuOpen && !isClosing) {
        closeMobileMenu();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen, isClosing]);

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
        scrolled || mobileMenuOpen ? "bg-background border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <div className="font-playfair text-xl md:text-2xl font-bold tracking-wide">
              <span className="text-primary">Hubert</span>
              <span className="text-foreground"> de </span>
              <span className="text-secondary">Blanck</span>
            </div>
          </NavLink>

          {/* DESKTOP MENU (Optimizado) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end} // Importante para la Home
                className={({ isActive }) =>
                  `font-outfit text-sm font-medium transition-all duration-300 uppercase tracking-wide relative group ${
                    isActive
                      ? "text-primary font-bold" // Estilo cuando estás en la página
                      : "text-foreground hover:text-primary" // Estilo normal
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* Línea animada debajo */}
                    <span 
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`} 
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* USER & MOBILE BUTTONS */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {!isAuthenticated ? (
                  <DropdownMenuItem asChild>
                    <NavLink to="/auth" className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </NavLink>
                  </DropdownMenuItem>
                ) : (
                  <>
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <NavLink to="/admin" className="cursor-pointer">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Panel Admin
                          </NavLink>
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
              onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU (Optimizado) */}
        {mobileMenuOpen && (
          <div className={`md:hidden pt-4 pb-4 border-t border-border/50 mt-4 bg-background transition-all duration-200 ${isClosing ? 'animate-fade-out opacity-0' : 'animate-fade-in'}`}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `font-outfit text-base font-medium transition-all duration-200 uppercase tracking-wide py-3 px-4 rounded-lg flex items-center ${
                      isActive
                        ? "text-primary bg-primary/10 font-bold border-l-4 border-primary" // Estilo Activo Móvil
                        : "text-foreground hover:text-primary hover:bg-muted" // Estilo Normal Móvil
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;