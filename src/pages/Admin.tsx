import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Camera, GraduationCap } from "lucide-react"; // Importar GraduationCap
import AdminPlaysTable from "@/components/admin/AdminPlaysTable";
import AdminActorsTable from "@/components/admin/AdminActorsTable";
import AdminImageManager from "@/components/admin/AdminImageManager";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import AdminWorkshopsTable from "@/components/admin/AdminWorkshopsTable"; // Importar
import AdminBlogTable from "@/components/admin/AdminBlogTable"; // Importar
import { FileText } from "lucide-react"; // Importar icono

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona producciones, elenco e imágenes</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="plays" className="w-full">
          {/* Aumentamos a 6 columnas */}
          <TabsList className="grid w-full max-w-5xl grid-cols-6">
            <TabsTrigger value="plays">Producciones</TabsTrigger>
            <TabsTrigger value="actors">Elenco</TabsTrigger>
            <TabsTrigger value="images">Archivos</TabsTrigger>
            <TabsTrigger value="gallery">
              <Camera className="mr-2 h-4 w-4" /> Galería
            </TabsTrigger>
            <TabsTrigger value="workshops">
              <GraduationCap className="mr-2 h-4 w-4" /> Talleres
            </TabsTrigger>
            {/* NUEVA PESTAÑA */}
            <TabsTrigger value="blog">
              <FileText className="mr-2 h-4 w-4" /> Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plays" className="mt-6">
            <AdminPlaysTable />
          </TabsContent>

          <TabsContent value="actors" className="mt-6">
            <AdminActorsTable />
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <AdminImageManager />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <AdminGalleryManager />
          </TabsContent>

          <TabsContent value="workshops" className="mt-6">
            <AdminWorkshopsTable />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <AdminBlogTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;