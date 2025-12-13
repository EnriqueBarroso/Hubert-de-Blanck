export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
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
          id: string
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
          author: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          published_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          play_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          play_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          play_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_play_id_fkey"
            columns: ["play_id"]
            isOneToOne: false
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
        ]
      }
      play_actors: {
        Row: {
          actor_id: string
          created_at: string
          id: string
          play_id: string
          role_in_play: string | null
        }
        Insert: {
          actor_id: string
          created_at?: string
          id?: string
          play_id: string
          role_in_play?: string | null
        }
        Update: {
          actor_id?: string
          created_at?: string
          id?: string
          play_id?: string
          role_in_play?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "play_actors_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_actors_play_id_fkey"
            columns: ["play_id"]
            isOneToOne: false
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
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
          title?: string
          updated_at?: string | null
          venue?: string | null
          year?: number | null
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
      workshops: {
        Row: {
          category: string | null
          created_at: string
          description: string
          duration: string | null
          id: string
          image: string | null
          instructor: string
          level: string | null
          max_students: number | null
          price: string | null
          schedule: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          duration?: string | null
          id?: string
          image?: string | null
          instructor: string
          level?: string | null
          max_students?: number | null
          price?: string | null
          schedule?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          duration?: string | null
          id?: string
          image?: string | null
          instructor?: string
          level?: string | null
          max_students?: number | null
          price?: string | null
          schedule?: string | null
          title?: string
          updated_at?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
