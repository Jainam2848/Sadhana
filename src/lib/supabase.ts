import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Retrieve environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://iwwziupfwytlbdlehgoh.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3ppdXBmd3l0bGJkbGVoZ29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjUzNjMsImV4cCI6MjA5NzIwMTM2M30.L0kqH4R2gsgOZ24U0bGBilIVaqXO_KEECBPDw-g2VNg';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('EXPO_PUBLIC_SUPABASE_URL is missing. Falling back to placeholder client.');
}

// Custom storage adapter utilizing Expo SecureStore for security
const SecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.error('SecureStore getItem error:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.error('SecureStore setItem error:', e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.error('SecureStore removeItem error:', e);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disables redirection checks for Web in RN context
  },
});
