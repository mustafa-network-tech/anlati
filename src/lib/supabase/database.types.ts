/**
 * ANLATI Veritabanı Tip Tanımları
 * Supabase CLI ile otomatik üretmek için:
 *   npx supabase gen types typescript --project-id mbydxsjvwgqxzudeceso > src/lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          is_anonymous_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_anonymous_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_anonymous_default?: boolean;
          updated_at?: string;
        };
      };
      stories: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          summary: string;
          full_text: string;
          category: string;
          is_anonymous: boolean;
          is_published: boolean;
          like_count: number;
          comment_count: number;
          read_count: number;
          share_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          summary: string;
          full_text: string;
          category: string;
          is_anonymous?: boolean;
          is_published?: boolean;
          like_count?: number;
          comment_count?: number;
          read_count?: number;
          share_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          summary?: string;
          full_text?: string;
          category?: string;
          is_anonymous?: boolean;
          is_published?: boolean;
          like_count?: number;
          comment_count?: number;
          read_count?: number;
          share_count?: number;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          story_id: string;
          author_id: string;
          content: string;
          is_anonymous: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          author_id: string;
          content: string;
          is_anonymous?: boolean;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          story_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
      };
      bookmarks: {
        Row: {
          id: string;
          story_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      story_category:
        | "iliskiler"
        | "annelik"
        | "is_hayati"
        | "yalnizlik"
        | "aile"
        | "yeniden_baslamak";
    };
  };
}
