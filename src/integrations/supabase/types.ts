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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_configs: {
        Row: {
          admin_email: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          admin_email: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          admin_email?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          admin_id: string
          created_at: string
          end_time: string
          id: string
          meeting_url: string | null
          start_time: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          end_time: string
          id?: string
          meeting_url?: string | null
          start_time: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          end_time?: string
          id?: string
          meeting_url?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: number
          image_url: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          image_url?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          image_url?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          full_name: string | null
          height: number | null
          id: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          height?: number | null
          id?: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          height?: number | null
          id?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      weekly_workout_details: {
        Row: {
          created_at: string
          day_name: string
          day_of_week: string
          exercises: Json
          id: string
          is_rest_day: boolean | null
          notes: string | null
          updated_at: string
          workout_plan_id: string
        }
        Insert: {
          created_at?: string
          day_name: string
          day_of_week: string
          exercises?: Json
          id?: string
          is_rest_day?: boolean | null
          notes?: string | null
          updated_at?: string
          workout_plan_id: string
        }
        Update: {
          created_at?: string
          day_name?: string
          day_of_week?: string
          exercises?: Json
          id?: string
          is_rest_day?: boolean | null
          notes?: string | null
          updated_at?: string
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_workout_details_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          created_by: string
          days_of_week: string[] | null
          exercises: Json
          id: string
          is_weekly_plan: boolean | null
          name: string
          observations: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          days_of_week?: string[] | null
          exercises?: Json
          id?: string
          is_weekly_plan?: boolean | null
          name: string
          observations?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          days_of_week?: string[] | null
          exercises?: Json
          id?: string
          is_weekly_plan?: boolean | null
          name?: string
          observations?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          created_at: string
          date: string
          duration: number | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          duration?: number | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_sets: {
        Row: {
          exercise_id: string
          id: string
          reps: number
          session_id: string
          timestamp: string
          weight: number
        }
        Insert: {
          exercise_id: string
          id?: string
          reps?: number
          session_id: string
          timestamp?: string
          weight?: number
        }
        Update: {
          exercise_id?: string
          id?: string
          reps?: number
          session_id?: string
          timestamp?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_weekly_workout_plan: {
        Args: {
          plan_name: string
          plan_observations?: string
          target_user_id: string
          weekly_schedule?: Json
        }
        Returns: string
      }
      get_default_admin_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_today_workout: {
        Args: { user_id?: string }
        Returns: {
          exercises: Json
          is_rest_day: boolean
          notes: string
          plan_name: string
        }[]
      }
      get_user_emails: {
        Args: { user_ids: string[] }
        Returns: {
          email: string
          full_name: string
          id: string
        }[]
      }
      get_user_weekly_plan: {
        Args: { user_id?: string }
        Returns: {
          day_name: string
          day_of_week: string
          exercises: Json
          is_rest_day: boolean
          notes: string
          plan_id: string
          plan_name: string
          plan_observations: string
        }[]
      }
      get_user_workout_plans: {
        Args: { target_user_id: string }
        Returns: {
          created_at: string
          created_by: string
          exercises: Json
          id: string
          name: string
          observations: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: { user_email?: string }
        Returns: boolean
      }
      is_email_verified: {
        Args: { user_id?: string }
        Returns: boolean
      }
      search_users: {
        Args: { search_term: string }
        Returns: {
          email: string
          full_name: string
          id: string
        }[]
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
    Enums: {},
  },
} as const
