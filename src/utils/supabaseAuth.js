/**
 * Supabase Authentication Wrapper
 * Provides auth functions that work with Supabase, with localStorage fallback
 */

import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Sign up with email and password
 */
export async function signUp(email, password, name) {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage auth
    const { signUp: localSignUp } = await import('./auth');
    const user = localSignUp(email, password, name);
    // Clear localStorage use count for new user
    localStorage.removeItem('clay_use_count');
    return user;
  }

  try {
    // Trim and validate email
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || trimmedEmail.length < 3) {
      throw new Error('Email is required and must be at least 3 characters');
    }
    
    // CRITICAL: Clear localStorage use count before signup (new user = fresh start)
    localStorage.removeItem('clay_use_count');
    
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: name?.trim() || '',
        }
      }
    });

    if (error) {
      // Better error messages
      if (error.message?.includes('email') || error.message?.includes('Email')) {
        throw new Error('Invalid email format. Please check and try again.');
      }
      throw error;
    }

    // Get user profile (wait a moment for trigger to create it)
    await new Promise(resolve => setTimeout(resolve, 500));
    const profile = await getUserProfile(data.user.id);

    // Ensure use count is 0 for new user (don't trust localStorage)
    if (profile?.use_count === undefined || profile?.use_count === null) {
      // Profile might not have use_count yet, ensure it's 0
      await updateUserProfile(data.user.id, { use_count: 0 }).catch(() => {
        // Ignore errors - profile might not exist yet
      });
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: name,
      isPro: profile?.is_pro || false,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to create account');
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage auth
    const { signIn: localSignIn } = await import('./auth');
    const user = localSignIn(email, password);
    // Clear localStorage use count - use database count instead
    localStorage.removeItem('clay_use_count');
    return user;
  }

  try {
    // CRITICAL: Clear localStorage use count on sign in (use database count)
    localStorage.removeItem('clay_use_count');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile
    const profile = await getUserProfile(data.user.id);

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || profile?.name || '',
      isPro: profile?.is_pro || false,
    };
  } catch (error) {
    throw new Error(error.message || 'Invalid email or password');
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage auth
    const { signOut: localSignOut } = await import('./auth');
    return localSignOut();
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    // Fallback to localStorage
    const { signOut: localSignOut } = await import('./auth');
    localSignOut();
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage auth
    const { getCurrentUser: localGetCurrentUser } = await import('./auth');
    return localGetCurrentUser();
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get profile from database
    const profile = await getUserProfile(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || profile?.name || '',
      isPro: profile?.is_pro || false,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    // Fallback to localStorage
    const { getCurrentUser: localGetCurrentUser } = await import('./auth');
    return localGetCurrentUser();
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  if (!isSupabaseConfigured()) {
    const { isAuthenticated: localIsAuthenticated } = require('./auth');
    return localIsAuthenticated();
  }

  // Check Supabase session
  const { data: { session } } = supabase.auth.getSession();
  return !!session;
}

/**
 * Get user profile from database
 */
async function getUserProfile(userId) {
  if (!isSupabaseConfigured() || !userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Update user profile (e.g., set isPro status)
 */
export async function updateUserProfile(userId, updates) {
  if (!isSupabaseConfigured() || !userId) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

/**
 * Set user as Pro (after payment)
 */
export async function setUserAsPro(userId) {
  return updateUserProfile(userId, { is_pro: true });
}

/**
 * Get user's use count from database
 */
export async function getUserUseCount(userId) {
  if (!isSupabaseConfigured() || !userId) {
    // Fallback to localStorage (only when Supabase not configured)
    const savedCount = localStorage.getItem('clay_use_count');
    return savedCount ? parseInt(savedCount, 10) : 0;
  }

  try {
    const profile = await getUserProfile(userId);
    // CRITICAL: Always use database count, never localStorage fallback when we have a user
    // If profile doesn't exist or use_count is null/undefined, default to 0
    const count = profile?.use_count ?? 0;
    
    // Ensure it's a valid number
    const useCount = typeof count === 'number' && !isNaN(count) ? count : 0;
    
    return useCount;
  } catch (error) {
    console.error('Error fetching use count:', error);
    // If we have a user ID, always return 0 (don't use localStorage for authenticated users)
    // Only use localStorage fallback when Supabase is not configured
    return 0;
  }
}

/**
 * Increment user's use count
 */
export async function incrementUseCount(userId) {
  if (!isSupabaseConfigured() || !userId) {
    // Fallback to localStorage (only when Supabase not configured)
    const currentCount = parseInt(localStorage.getItem('clay_use_count') || '0', 10);
    const newCount = currentCount + 1;
    localStorage.setItem('clay_use_count', newCount.toString());
    return newCount;
  }

  try {
    const profile = await getUserProfile(userId);
    const currentCount = profile?.use_count ?? 0;
    const newCount = currentCount + 1;
    
    await updateUserProfile(userId, { use_count: newCount });
    // Don't update localStorage - it causes cross-user contamination
    return newCount;
  } catch (error) {
    console.error('Error incrementing use count:', error);
    // For authenticated users, don't fall back to localStorage
    // Return current count + 1 but don't persist (will be saved on next successful DB call)
    const profile = await getUserProfile(userId).catch(() => null);
    const currentCount = profile?.use_count ?? 0;
    return currentCount + 1;
  }
}

/**
 * Reset use count (e.g., when user upgrades to Pro)
 */
export async function resetUseCount(userId) {
  if (!isSupabaseConfigured() || !userId) {
    localStorage.removeItem('clay_use_count');
    return 0;
  }

  try {
    await updateUserProfile(userId, { use_count: 0 });
    localStorage.removeItem('clay_use_count'); // Also clear localStorage
    return 0;
  } catch (error) {
    console.error('Error resetting use count:', error);
    localStorage.removeItem('clay_use_count');
    return 0;
  }
}

