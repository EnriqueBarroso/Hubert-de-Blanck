import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Camera, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyGallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // Solo traemos las 4 imágenes más recientes
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);
        
        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="py-20 bg-background border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="font-outfit text-sm font-medium text-primary mb-4 tracking-widest uppercase flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Memoria Visual
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Instantes en Escena
            </h2>
            <p className="font-outfit text-lg text-muted-foreground">
              Un vistazo a nuestros momentos más recientes.
            </p>
          </div>
          
          <Link to="/galeria">
            <Button variant="outline" className="font-outfit hidden md:flex">
              Ver Galería Completa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square w-full rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <Dialog key={image.id}>
                <DialogTrigger asChild>
                  <Card className="group relative overflow-hidden border-none cursor-pointer aspect-square rounded-lg">
                    <CardContent className="p-0 h-full w-full">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Maximize2 className="h-8 w-8 text-white" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl bg-transparent border-none p-0">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-md"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/galeria">
            <Button variant="outline" className="font-outfit w-full">
              Ver Galería Completa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanyGallery;