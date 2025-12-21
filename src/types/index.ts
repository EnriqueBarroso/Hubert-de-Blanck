import { Database } from "@/integrations/supabase/types";

// Tipos para consultas (SELECT)
export type Play = Database['public']['Tables']['plays']['Row'];
export type Actor = Database['public']['Tables']['actors']['Row'];

// 🔴 CORRECCIÓN AQUÍ: Definimos GalleryItem manualmente para asegurar que tenga image_url
export type GalleryItem = {
  id: string;
  created_at: string;
  title: string | null;
  image_url: string;       // ✅ Ahora coincide con tu Base de Datos
  category: string | null; // ✅ Ahora coincide con tu Base de Datos
  play_id: string | null;
  play?: Play | null;
};

export type Workshop = Database['public']['Tables']['workshops']['Row'];

// Tipos para inserciones (INSERT)
export type PlayInsert = Database['public']['Tables']['plays']['Insert'];
export type ActorInsert = Database['public']['Tables']['actors']['Insert'];
export type GalleryItemInsert = Database['public']['Tables']['gallery']['Insert'];
export type WorkshopInsert = Database['public']['Tables']['workshops']['Insert'];

// Tipos para actualizaciones (UPDATE)
export type PlayUpdate = Database['public']['Tables']['plays']['Update'];
export type ActorUpdate = Database['public']['Tables']['actors']['Update'];
export type GalleryItemUpdate = Database['public']['Tables']['gallery']['Update'];
export type WorkshopUpdate = Database['public']['Tables']['workshops']['Update'];

// Tipos para la relación Elenco
export type PlayActor = Database['public']['Tables']['play_actors']['Row'] & {
  actor?: Actor;
};
export type PlayActorInsert = Database['public']['Tables']['play_actors']['Insert'];

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null; // OJO: Verifica si en la tabla blog_posts la columna se llama 'image' o 'image_url'
  author: string;
  category: string | null;
  published_at: string;
  created_at: string;
};

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'published_at'>;
export type BlogPostUpdate = Partial<BlogPostInsert>;