export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actors: {
        Row: {
          bio: string
          created_at: string | null
          id: string
          image: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          bio: string
          created_at?: string | null
          id?: string
          image: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          bio?: string
          created_at?: string | null
          id?: string
          image?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          image: string | null
          author: string | null
          category: string | null
          published_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          image?: string | null
          author?: string | null
          category?: string | null
          published_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          image?: string | null
          author?: string | null
          category?: string | null
          published_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          id: string
          title: string
          category: string
          image_url: string
          created_at: string | null
          play_id: string | null
        }
        Insert: {
          id?: string
          title: string
          category: string
          image_url: string
          created_at?: string | null
          play_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          category?: string
          image_url?: string
          created_at?: string | null
          play_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_play_id_fkey"
            columns: ["play_id"]
            referencedRelation: "plays"
            referencedColumns: ["id"]
          }
        ]
      }
      plays: {
        Row: {
          author: string
          availability: string | null
          category: string
          created_at: string | null
          date: string | null
          description: string
          id: string
          image: string
          status: string | null
          time: string | null
          title: string
          updated_at: string | null
          venue: string | null
          year: number | null
        }
        Insert: {
          author: string
          availability?: string | null
          category: string
          created_at?: string | null
          date?: string | null
          description: string
          id: string
          image: string
          status?: string | null
          time?: string | null
          title: string
          updated_at?: string | null
          venue?: string | null
          year?: number | null
        }
        Update: {
          author?: string
          availability?: string | null
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          image?: string
          status?: string | null
          time?: string | null
          title: string
          updated_at?: string | null
          venue?: string | null
          year?: number | null
        }
        Relationships: []
      }
      play_actors: {
        Row: {
          id: string
          play_id: string
          actor_id: string
          character_name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          play_id: string
          actor_id: string
          character_name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          play_id?: string
          actor_id?: string
          character_name?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "play_actors_actor_id_fkey"
            columns: ["actor_id"]
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_actors_play_id_fkey"
            columns: ["play_id"]
            referencedRelation: "plays"
            referencedColumns: ["id"]
          }
        ]
      }
      workshops: {
        Row: {
          id: string
          title: string
          description: string
          long_description: string | null
          instructor: string
          instructor_bio: string | null
          level: string
          duration: string | null
          schedule: string | null
          max_students: number
          enrolled: number
          price: number
          image: string | null
          features: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          long_description?: string | null
          instructor: string
          instructor_bio?: string | null
          level: string
          duration?: string | null
          schedule?: string | null
          max_students?: number
          enrolled?: number
          price?: number
          image?: string | null
          features?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          long_description?: string | null
          instructor?: string
          instructor_bio?: string | null
          level?: string
          duration?: string | null
          schedule?: string | null
          max_students?: number
          enrolled?: number
          price?: number
          image?: string | null
          features?: string[] | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}