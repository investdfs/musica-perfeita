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
      music_catalog: {
        Row: {
          artist: string
          audiourl: string
          coverurl: string
          created_at: string | null
          duration: number
          genre: string | null
          id: string
          plays: number | null
          title: string
        }
        Insert: {
          artist: string
          audiourl: string
          coverurl: string
          created_at?: string | null
          duration: number
          genre?: string | null
          id?: string
          plays?: number | null
          title: string
        }
        Update: {
          artist?: string
          audiourl?: string
          coverurl?: string
          created_at?: string | null
          duration?: number
          genre?: string | null
          id?: string
          plays?: number | null
          title?: string
        }
        Relationships: []
      }
      music_requests: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          custom_relationship: string | null
          full_song_url: string | null
          happy_memory: string | null
          has_technical_details: boolean | null
          honoree_name: string
          id: string
          include_names: boolean
          music_focus: string | null
          music_genre: string
          music_tone: string | null
          names_to_include: string | null
          order_number: string | null
          payment_status: string | null
          preview_url: string | null
          relationship_type: string
          sad_memory: string | null
          status: string
          story: string
          technical_details: string | null
          user_id: string
          voice_type: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          custom_relationship?: string | null
          full_song_url?: string | null
          happy_memory?: string | null
          has_technical_details?: boolean | null
          honoree_name: string
          id?: string
          include_names?: boolean
          music_focus?: string | null
          music_genre: string
          music_tone?: string | null
          names_to_include?: string | null
          order_number?: string | null
          payment_status?: string | null
          preview_url?: string | null
          relationship_type: string
          sad_memory?: string | null
          status?: string
          story: string
          technical_details?: string | null
          user_id: string
          voice_type?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          custom_relationship?: string | null
          full_song_url?: string | null
          happy_memory?: string | null
          has_technical_details?: boolean | null
          honoree_name?: string
          id?: string
          include_names?: boolean
          music_focus?: string | null
          music_genre?: string
          music_tone?: string | null
          names_to_include?: string | null
          order_number?: string | null
          payment_status?: string | null
          preview_url?: string | null
          relationship_type?: string
          sad_memory?: string | null
          status?: string
          story?: string
          technical_details?: string | null
          user_id?: string
          voice_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "music_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_counters: {
        Row: {
          current_count: number
          id: string
          year: string
        }
        Insert: {
          current_count?: number
          id: string
          year: string
        }
        Update: {
          current_count?: number
          id?: string
          year?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          payment_link: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          payment_link: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          payment_link?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          visitor_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          visitor_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          visitor_count?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          is_main_admin: boolean | null
          name: string
          password: string
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          is_main_admin?: boolean | null
          name: string
          password: string
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          is_main_admin?: boolean | null
          name?: string
          password?: string
          whatsapp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_visitor_count: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
