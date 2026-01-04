import { supabase } from '../lib/supabase';
import { User } from '../types';

// Simple password hashing (in production, use bcrypt on backend)
// For now, we'll store passwords as-is (NOT SECURE - but user requested this)
// In a real app, you'd hash on backend
async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - in production use proper hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signUp(username: string, password: string, email?: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const hashedPassword = await hashPassword(password);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          password: hashedPassword,
          email: email || null,
          is_admin: false
        }
      ])
      .select()
      .single();

    if (error) {
      return { user: null, error: error.message };
    }

    return {
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        created_at: data.created_at,
        is_admin: data.is_admin
      },
      error: null
    };
  } catch (err: any) {
    return { user: null, error: err.message || 'Sign up failed' };
  }
}

export async function signIn(username: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const hashedPassword = await hashPassword(password);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', hashedPassword)
      .single();

    if (error || !data) {
      return { user: null, error: 'Invalid username or password' };
    }

    return {
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        created_at: data.created_at,
        is_admin: data.is_admin || false
      },
      error: null
    };
  } catch (err: any) {
    return { user: null, error: err.message || 'Sign in failed' };
  }
}

export async function getAllUsers(): Promise<{ users: any[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, is_admin, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return { users: [], error: error.message };
    }

    return { users: data || [], error: null };
  } catch (err: any) {
    return { users: [], error: err.message || 'Failed to fetch users' };
  }
}

