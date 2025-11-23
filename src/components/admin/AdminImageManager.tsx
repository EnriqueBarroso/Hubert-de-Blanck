import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";

interface StorageImage {
  name: string;
  url: string;
  bucket: string;
}

const AdminImageManager = () => {
  const { toast } = useToast();
  const [playImages, setPlayImages] = useState<StorageImage[]>([]);
  const [actorImages, setActorImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      // Fetch play images
      const { data: playData, error: playError } = await supabase.storage
        .from("play-images")
        .list();

      if (playError) throw playError;

      const playImagesWithUrls = playData.map((file) => ({
        name: file.name,
        url: supabase.storage.from("play-images").getPublicUrl(file.name).data.publicUrl,
        bucket: "play-images",
      }));

      setPlayImages(playImagesWithUrls);

      // Fetch actor images
      const { data: actorData, error: actorError } = await supabase.storage
        .from("actor-images")
        .list();

      if (actorError) throw actorError;

      const actorImagesWithUrls = actorData.map((file) => ({
        name: file.name,
        url: supabase.storage.from("actor-images").getPublicUrl(file.name).data.publicUrl,
        bucket: "actor-images",
      }));

      setActorImages(actorImagesWithUrls);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las imágenes: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (bucket: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona un archivo de imagen válido.",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage.from(bucket).upload(fileName, file);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Imagen subida correctamente.",
      });

      fetchImages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la imagen: " + error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (bucket: string, fileName: string) => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([fileName]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Imagen eliminada correctamente.",
      });

      fetchImages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la imagen: " + error.message,
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copiado",
      description: "URL copiada al portapapeles.",
    });
  };

  const ImageGrid = ({ images, bucket }: { images: StorageImage[]; bucket: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <Card key={image.name} className="overflow-hidden">
          <div className="aspect-video relative bg-muted">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <p className="text-sm font-medium truncate mb-3">{image.name}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(image.url)}
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar URL
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(bucket, image.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando imágenes...</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="plays" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="plays">
          <ImageIcon className="mr-2 h-4 w-4" />
          Producciones
        </TabsTrigger>
        <TabsTrigger value="actors">
          <ImageIcon className="mr-2 h-4 w-4" />
          Actores
        </TabsTrigger>
      </TabsList>

      <TabsContent value="plays" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subir Imagen de Producción</CardTitle>
            <CardDescription>
              Formatos permitidos: JPG, PNG, WEBP. Máximo 5MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload("play-images", file);
                }}
                disabled={uploading}
              />
              <Button disabled={uploading} variant="secondary">
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <ImageGrid images={playImages} bucket="play-images" />
      </TabsContent>

      <TabsContent value="actors" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subir Imagen de Actor</CardTitle>
            <CardDescription>
              Formatos permitidos: JPG, PNG, WEBP. Máximo 5MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload("actor-images", file);
                }}
                disabled={uploading}
              />
              <Button disabled={uploading} variant="secondary">
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <ImageGrid images={actorImages} bucket="actor-images" />
      </TabsContent>
    </Tabs>
  );
};

export default AdminImageManager;
