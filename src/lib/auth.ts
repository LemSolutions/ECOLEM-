/**
 * Simple admin authentication
 * In production, consider using Supabase Auth for better security
 */

// Admin credentials from env (set in .env.local)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lemsolutions2024';

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Session token (simple implementation)
export function generateSessionToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random().toString(36)}`).toString('base64');
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [timestamp] = decoded.split('-');
    const sessionAge = Date.now() - parseInt(timestamp);
    // Session valid for 24 hours
    return sessionAge < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
