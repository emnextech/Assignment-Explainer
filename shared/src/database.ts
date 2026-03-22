export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          university: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          university?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          university?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      assignments: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          course_name: string | null;
          question_text: string;
          word_count: number | null;
          level: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          course_name?: string | null;
          question_text: string;
          word_count?: number | null;
          level?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          course_name?: string | null;
          question_text?: string;
          word_count?: number | null;
          level?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      assignment_explanations: {
        Row: {
          id: string;
          assignment_id: string;
          user_id: string;
          status: "pending" | "completed" | "failed" | "refused";
          model: string;
          simplified_explanation: string | null;
          lecturer_intent: string | null;
          step_by_step: Json | null;
          suggested_structure: Json | null;
          key_topics: Json | null;
          common_mistakes: Json | null;
          refusal_reason: string | null;
          error_message: string | null;
          raw_response: Json | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          user_id: string;
          status?: "pending" | "completed" | "failed" | "refused";
          model: string;
          simplified_explanation?: string | null;
          lecturer_intent?: string | null;
          step_by_step?: Json | null;
          suggested_structure?: Json | null;
          key_topics?: Json | null;
          common_mistakes?: Json | null;
          refusal_reason?: string | null;
          error_message?: string | null;
          raw_response?: Json | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          user_id?: string;
          status?: "pending" | "completed" | "failed" | "refused";
          model?: string;
          simplified_explanation?: string | null;
          lecturer_intent?: string | null;
          step_by_step?: Json | null;
          suggested_structure?: Json | null;
          key_topics?: Json | null;
          common_mistakes?: Json | null;
          refusal_reason?: string | null;
          error_message?: string | null;
          raw_response?: Json | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "assignment_explanations_assignment_id_fkey";
            columns: ["assignment_id"];
            referencedRelation: "assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignment_explanations_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type AssignmentRow = Database["public"]["Tables"]["assignments"]["Row"];
export type AssignmentExplanationRow =
  Database["public"]["Tables"]["assignment_explanations"]["Row"];
