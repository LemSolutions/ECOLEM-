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
          image_url: string | null;
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

      // ═══════════════════════════════════════════════════════════════════
      // ABOUT SECTIONS
      // ═══════════════════════════════════════════════════════════════════
      about_sections: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          content: string;
          image_url: string | null;
          image_position: 'left' | 'right' | 'top' | 'bottom';
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['about_sections']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['about_sections']['Insert']>;
      };

      // ═══════════════════════════════════════════════════════════════════
      // QUOTE PRODUCTS (Prodotti Interni per Preventivi)
      // ═══════════════════════════════════════════════════════════════════
      quote_products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          base_price: number;
          unit: string;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quote_products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quote_products']['Insert']>;
      };

      // ═══════════════════════════════════════════════════════════════════
      // QUOTE PACKAGES (Pacchetti Preconfigurati)
      // ═══════════════════════════════════════════════════════════════════
      quote_packages: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          items: Record<string, unknown>;
          total_price: number;
          discount_percentage: number;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quote_packages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quote_packages']['Insert']>;
      };

      // ═══════════════════════════════════════════════════════════════════
      // QUOTES (Preventivi Generati)
      // ═══════════════════════════════════════════════════════════════════
      quotes: {
        Row: {
          id: string;
          quote_number: string;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          customer_address: string | null;
          language: 'it' | 'en' | 'es' | 'fr' | 'pt' | 'cn' | 'rs';
          items: Record<string, unknown>;
          subtotal: number;
          discount_percentage: number;
          discount_amount: number;
          total: number;
          notes: string | null;
          payment_method: 'iban' | 'banca' | 'bonifico' | 'altro' | null;
          payment_details: string | null;
          validity_days: number;
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>;
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

export type AboutSection = Database['public']['Tables']['about_sections']['Row'];
export type AboutSectionInsert = Database['public']['Tables']['about_sections']['Insert'];
export type AboutSectionUpdate = Database['public']['Tables']['about_sections']['Update'];

export type QuoteProduct = Database['public']['Tables']['quote_products']['Row'];
export type QuoteProductInsert = Database['public']['Tables']['quote_products']['Insert'];
export type QuoteProductUpdate = Database['public']['Tables']['quote_products']['Update'];

export type QuotePackage = Database['public']['Tables']['quote_packages']['Row'];
export type QuotePackageInsert = Database['public']['Tables']['quote_packages']['Insert'];
export type QuotePackageUpdate = Database['public']['Tables']['quote_packages']['Update'];

export type Quote = Database['public']['Tables']['quotes']['Row'];
export type QuoteInsert = Database['public']['Tables']['quotes']['Insert'];
export type QuoteUpdate = Database['public']['Tables']['quotes']['Update'];

// ═══════════════════════════════════════════════════════════════════════════
// QUOTE HELPER TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface QuoteItem {
  product_id?: string;
  product_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface QuotePackageItem {
  product_id: string;
  quantity: number;
  price_override?: number;
}
