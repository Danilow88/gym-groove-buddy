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
      exercise_videos: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          storage_path: string | null
          uploaded_by: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          storage_path?: string | null
          uploaded_by: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          storage_path?: string | null
          uploaded_by?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_videos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "workout_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          }
        ]
      }
      appointments: {
        Row: {
          admin_id: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          status: "available" | "booked" | "cancelled"
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          status?: "available" | "booked" | "cancelled"
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          status?: "available" | "booked" | "cancelled"
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_workout_plans: {
        Args: {
          target_user_id: string
        }
        Returns: {
          id: string
          name: string
          exercises: Json
          observations: string | null
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: {
          user_email?: string
        }
        Returns: boolean
      }
      is_email_verified: {
        Args: {
          user_id?: string
        }
        Returns: boolean
      }
      get_user_weekly_plan: {
        Args: {
          user_id?: string
        }
        Returns: {
          plan_id: string
          plan_name: string
          plan_observations: string | null
          day_of_week: string
          day_name: string
          exercises: Json
          notes: string | null
          is_rest_day: boolean
        }[]
      }
      get_today_workout: {
        Args: {
          user_id?: string
        }
        Returns: {
          plan_name: string
          exercises: Json
          notes: string | null
          is_rest_day: boolean
        }[]
      }
      create_weekly_workout_plan: {
        Args: {
          target_user_id: string
          plan_name: string
          plan_observations?: string
          weekly_schedule?: Json
        }
        Returns: string
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
