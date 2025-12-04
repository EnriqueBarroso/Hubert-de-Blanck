import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { BlogPost, BlogPostInsert, BlogPostUpdate } from "@/types";

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onSuccess: () => void;
}

const BlogDialog = ({ open, onOpenChange, post, onSuccess }: BlogDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<BlogPostInsert>({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "Hubert de Blanck",
    category: "Noticias",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image || "",
        author: post.author,
        category: post.category || "Noticias",
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        author: "Hubert de Blanck",
        category: "Noticias",
      });
    }
  }, [post, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      toast({ title: "Imagen subida correctamente" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (post) {
        const { error } = await supabase
          .from("blog_posts")
          .update(formData as BlogPostUpdate)
          .eq("id", post.id);
        if (error) throw error;
        toast({ title: "Artículo actualizado" });
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Artículo publicado" });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={formData.category || "Noticias"} onValueChange={v => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Noticias">Noticias</SelectItem>
                  <SelectItem value="Críticas">Críticas</SelectItem>
                  <SelectItem value="Entrevistas">Entrevistas</SelectItem>
                  <SelectItem value="Historia">Historia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Autor</Label>
              <Input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resumen (Excerpt) *</Label>
            <Textarea 
              value={formData.excerpt} 
              onChange={e => setFormData({...formData, excerpt: e.target.value})} 
              placeholder="Breve descripción que aparecerá en la tarjeta..."
              required 
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen de Portada</Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-24 h-16 object-cover rounded border" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contenido del Artículo *</Label>
            <Textarea 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              placeholder="Escribe aquí el cuerpo del artículo..."
              required 
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">Tip: Usa doble salto de línea para separar párrafos.</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : "Publicar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;