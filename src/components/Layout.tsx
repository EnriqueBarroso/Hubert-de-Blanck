import { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

// EL ERROR ESTÁ AQUÍ: Añade el '?' después de children
interface LayoutProps {
  children?: ReactNode; // <--- Con ? es opcional
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Si pasamos hijos (children) los usa, si no, usa el Outlet (rutas anidadas) */}
        {children || <Outlet />}
      </main>

      <footer className="bg-theater-darker py-12 border-t border-border mt-auto">
        {/* ... (resto del footer igual) ... */}
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
                <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                <li><Link to="/cartelera" className="hover:text-primary transition-colors">Cartelera</Link></li>
                <li><Link to="/compania" className="hover:text-primary transition-colors">La Compañía</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li>info@hubertdeblanck.com</li>
                <li>+53 7 830 1011</li>
                <li>Calzada e/ A y B, Vedado</li>
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
            <p>&copy; {new Date().getFullYear()} Compañía Hubert de Blanck. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;