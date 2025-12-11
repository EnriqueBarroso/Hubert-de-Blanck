import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem, Play } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, History, Drama, Building, Users, FolderOpen, ArrowLeft } from "lucide-react";
import ImageViewer from "@/components/ImageViewer";

const Galeria = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [playsWithPhotos, setPlaysWithPhotos] = useState<Play[]>([]);
  
  const [viewMode, setViewMode] = useState<"albums" | "grid">("albums");
  const [selectedPlayAlbum, setSelectedPlayAlbum] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("Todos");
  
  const [loading, setLoading] = useState(true);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filters = [
    { id: "Todos", label: "Todo", icon: Filter },
    { id: "Historia", label: "Historia", icon: History },
    { id: "Espacios", label: "Espacios", icon: Building },
    { id: "Ensayos", label: "Ensayos", icon: Users },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: galleryData, error } = await supabase
        .from("gallery")
        .select(`*, play:plays(*)`)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      const allImages = (galleryData as unknown) as GalleryItem[] || [];
      setImages(allImages);

      const playsMap = new Map<string, Play>();
      allImages.forEach(img => {
        if (img.play) playsMap.set(img.play.id, img.play);
      });
      setPlaysWithPhotos(Array.from(playsMap.values()));

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredImages = () => {
    if (selectedPlayAlbum) {
      return images.filter(img => img.play_id === selectedPlayAlbum);
    }
    if (activeCategoryFilter === "Todos") return images;
    return images.filter(img => img.category === activeCategoryFilter);
  };

  const filteredImages = getFilteredImages();
  const currentPlayTitle = playsWithPhotos.find(p => p.id === selectedPlayAlbum)?.title;

  const openViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <>
      <section className="pt-32 pb-12 bg-theater-darker">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-4">
            Archivo Visual
          </h1>
          <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            35 años de historia. Navega por nuestras puestas en escena o explora nuestro archivo general.
          </p>

          {!selectedPlayAlbum && (
            <div className="flex justify-center gap-4 mb-8">
                <Button 
                    variant={viewMode === "albums" ? "default" : "outline"}
                    onClick={() => setViewMode("albums")}
                    className="font-outfit"
                >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Por Obras
                </Button>
                <Button 
                    variant={viewMode === "grid" ? "default" : "outline"}
                    onClick={() => setViewMode("grid")}
                    className="font-outfit"
                >
                    <Drama className="mr-2 h-4 w-4" />
                    Archivo General
                </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 flex-grow">
        <div className="container mx-auto">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-lg" />)}
             </div>
          ) : (
            <>
                {viewMode === "albums" && !selectedPlayAlbum && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {playsWithPhotos.map(play => {
                            const coverImage = images.find(img => img.play_id === play.id)?.image_url;
                            return (
                                <div 
                                    key={play.id} 
                                    onClick={() => setSelectedPlayAlbum(play.id)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 border border-border shadow-md group-hover:shadow-primary/20 transition-all">
                                        {coverImage ? (
                                            <img src={coverImage} alt={play.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Drama className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-outfit">
                                            {images.filter(i => i.play_id === play.id).length} fotos
                                        </div>
                                    </div>
                                    <h3 className="font-playfair text-2xl font-bold text-foreground group-hover:text-primary transition-colors text-center">
                                        {play.title}
                                    </h3>
                                    <p className="text-center text-sm text-muted-foreground font-outfit mt-1">
                                        {play.year ? `Año ${play.year}` : "Producción"}
                                    </p>
                                </div>
                            );
                        })}
                        {playsWithPhotos.length === 0 && (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                No hay álbumes de obras creados aún.
                            </div>
                        )}
                    </div>
                )}

                {(viewMode === "grid" || selectedPlayAlbum) && (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            {selectedPlayAlbum ? (
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setSelectedPlayAlbum(null)}
                                    className="self-start md:self-center font-outfit hover:bg-transparent hover:text-primary p-0"
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    Volver a Álbumes
                                </Button>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {filters.map(f => (
                                        <Button
                                            key={f.id}
                                            variant={activeCategoryFilter === f.id ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setActiveCategoryFilter(f.id)}
                                            className="font-outfit"
                                        >
                                            {f.label}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {selectedPlayAlbum && (
                                <h2 className="font-playfair text-3xl font-bold text-primary">
                                    {currentPlayTitle}
                                </h2>
                            )}
                        </div>

                        <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {filteredImages.map((image, index) => (
                                <div 
                                  key={image.id}
                                  className="break-inside-avoid mb-4 group relative cursor-pointer overflow-hidden rounded-lg bg-card"
                                  onClick={() => openViewer(index)}
                                >
                                    <img
                                        src={image.image_url}
                                        alt={image.title}
                                        className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                                        loading="lazy"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-playfair">{image.title}</p>
                                    </div>
                                </div>
                            ))}
                            {filteredImages.length === 0 && (
                                <p className="text-muted-foreground col-span-full text-center py-10">
                                    No hay imágenes para mostrar aquí.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </>
          )}
        </div>
      </section>

      <ImageViewer 
        images={filteredImages}
        initialIndex={currentImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
};

export default Galeria;