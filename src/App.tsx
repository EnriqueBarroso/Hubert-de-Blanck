import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Importación de páginas
import Index from "./pages/Index";
import Cartelera from "./pages/Cartelera";
import Compania from "./pages/Compania";
import Elenco from "./pages/Elenco";
import Producciones from "./pages/Producciones";
import ProduccionDetalle from "./pages/ProduccionDetalle";
import Talleres from "./pages/Talleres";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Galeria from "./pages/Galeria";
import Historia from "./pages/Historia";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* RUTAS PÚBLICAS (Envueltas en Layout) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/cartelera" element={<Cartelera />} />
            <Route path="/compania" element={<Compania />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/elenco" element={<Elenco />} />
            <Route path="/producciones" element={<Producciones />} />
            <Route path="/producciones/:id" element={<ProduccionDetalle />} />
            <Route path="/talleres" element={<Talleres />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contacto" element={<Contacto />} />
            {/* Página 404 también con Layout */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* RUTAS SIN LAYOUT (Admin y Login) */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;