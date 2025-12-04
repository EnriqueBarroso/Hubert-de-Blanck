import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cartelera from "./pages/Cartelera";
import Compania from "./pages/Compania";
import Talleres from "./pages/Talleres";
import Blog from "./pages/Blog";
import Elenco from "./pages/Elenco";
import Producciones from "./pages/Producciones";
import ProduccionDetalle from "./pages/ProduccionDetalle";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
// Importamos el componente de protección
import ProtectedRoute from "@/components/ProtectedRoute";
import Galeria from "./pages/Galeria";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cartelera" element={<Cartelera />} />
          <Route path="/compania" element={<Compania />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/producciones" element={<Producciones />} />
          <Route path="/producciones/:id" element={<ProduccionDetalle />} />
          <Route path="/talleres" element={<Talleres />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/elenco" element={<Elenco />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Rutas Protegidas de Administrador */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;