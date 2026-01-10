import { Database } from "@/integrations/supabase/types";

// Tipos para consultas (SELECT)
export type Play = Database['public']['Tables']['plays']['Row'];
export type Actor = Database['public']['Tables']['actors']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'] & {
  play?: Play | null;
};
export type Workshop = Database['public']['Tables']['workshops']['Row']; // <--- NUEVO

// Tipos para inserciones (INSERT)
export type PlayInsert = Database['public']['Tables']['plays']['Insert'];
export type ActorInsert = Database['public']['Tables']['actors']['Insert'];
export type GalleryItemInsert = Database['public']['Tables']['gallery']['Insert'];
export type WorkshopInsert = Database['public']['Tables']['workshops']['Insert']; // <--- NUEVO

// Tipos para actualizaciones (UPDATE)
export type PlayUpdate = Database['public']['Tables']['plays']['Update'];
export type ActorUpdate = Database['public']['Tables']['actors']['Update'];
export type GalleryItemUpdate = Database['public']['Tables']['gallery']['Update'];
export type WorkshopUpdate = Database['public']['Tables']['workshops']['Update']; // <--- NUEVO

// Tipos para la relación Elenco
export type PlayActor = Database['public']['Tables']['play_actors']['Row'] & {
  actor?: Actor;
};
export type PlayActorInsert = Database['public']['Tables']['play_actors']['Insert'];

// Tipos para Blog Posts (usando tipos generados de Supabase)
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];