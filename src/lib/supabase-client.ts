/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUPABASE CLIENT CONFIGURATION
 * Clean setup for Supabase integration with proper env handling
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLES
// ═══════════════════════════════════════════════════════════════════════════

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

function validateEnvVars(): void {
  if (!supabaseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please add it to your .env.local file.'
    );
  }
  
  if (!supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please add it to your .env.local file.'
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT-SIDE SUPABASE CLIENT
// ═══════════════════════════════════════════════════════════════════════════

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    validateEnvVars();
    
    supabaseClient = createClient<Database>(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );
  }
  
  return supabaseClient;
}

export const supabase = getSupabaseClient;

// ═══════════════════════════════════════════════════════════════════════════
// SERVER-SIDE SUPABASE CLIENT (Admin)
// ═══════════════════════════════════════════════════════════════════════════

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (typeof window !== 'undefined') {
    throw new Error(
      'getSupabaseAdmin() should only be called server-side. ' +
      'Use getSupabaseClient() for client-side operations.'
    );
  }
  
  validateEnvVars();
  
  if (!supabaseServiceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This key is required for server-side admin operations.'
    );
  }
  
  return createClient<Database>(
    supabaseUrl!,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export type { Database };
export type { User, Session, AuthError } from '@supabase/supabase-js';
