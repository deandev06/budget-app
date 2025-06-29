import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// For Expo web, we need to access environment variables differently
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://frojfjqfzqiioekfkmpx.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2pmanFmenFpaW9la2ZrbXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTU0NTMsImV4cCI6MjA2Njc3MTQ1M30.3yZO07sFDqxxN7qP3V9bDRyXCLqX7a7sq6DkMeWWAuk';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});