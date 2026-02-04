/**
 * Data fetching utilities for Supabase
 */

import { getSupabaseClient } from './supabase-client';
import type { Service, Product, BlogPost, Testimonial, ContactSubmissionInsert } from '@/types/database';

// ═══════════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════════

export async function getServices(): Promise<Service[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return data || [];
}

export async function getAllServices(): Promise<Service[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching all services:', error);
    return [];
  }
  return data || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
  return data || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOG
// ═══════════════════════════════════════════════════════════════════════════

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  return data || [];
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }
  return data || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════════════════

export async function submitContactForm(formData: ContactSubmissionInsert): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('contact_submissions').insert([formData]);
  if (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getContactSubmissions() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
  return data || [];
}
