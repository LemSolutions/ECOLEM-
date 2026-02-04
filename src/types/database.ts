/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATABASE TYPES
 * TypeScript types for Supabase database schema
 * Allineato con supabase/schema.sql
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Database {
  public: {
    Tables: {
      // ═══════════════════════════════════════════════════════════════════
      // SERVICES
      // ═══════════════════════════════════════════════════════════════════
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string | null;
          features: string[] | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };

      // ═══════════════════════════════════════════════════════════════════
      // PRODUCTS (Pacchetti/Offerte)
      // ═══════════════════════════════════════════════════════════════════
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          short_description: string | null;
          price: number | null;
          price_type: 'fixed' | 'starting_from' | 'on_request';
          category: string | null;
          image_url: string | null;
          features: string[] | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };

      // ═══════════════════════════════════════════════════════════════════
      // BLOG POSTS
      // ═══════════════════════════════════════════════════════════════════
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          author: string | null;
          image_url: string | null;
          category: string | null;
          tags: string[] | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };

      // ═══════════════════════════════════════════════════════════════════
      // CONTACT SUBMISSIONS
      // ═══════════════════════════════════════════════════════════════════
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          service_interest: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at' | 'is_read'>;
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
    };
    
    Views: Record<string, never>;
    Functions: Record<string, never>;
    
    Enums: {
      price_type: 'fixed' | 'starting_from' | 'on_request';
    };
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
export type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert'];
