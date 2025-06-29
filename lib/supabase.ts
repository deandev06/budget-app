import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Get environment variables with fallbacks
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://frojfjqfzqiioekfkmpx.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2pmanFmenFpaW9la2ZrbXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTU0NTMsImV4cCI6MjA2Njc3MTQ1M30.3yZO07sFDqxxN7qP3V9bDRyXCLqX7a7sq6DkMeWWAuk';

// Validate that we have the required values
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Using fallback values.');
}

// Create the Supabase client with error handling
let supabase: ReturnType<typeof createClient<Database>>;

try {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} catch (error) {
  console.error('Error creating Supabase client:', error);
  // Create a minimal client that won't crash the app
  supabase = createClient<Database>(
    'https://frojfjqfzqiioekfkmpx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2pmanFmenFpaW9la2ZrbXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTU0NTMsImV4cCI6MjA2Njc3MTQ1M30.3yZO07sFDqxxN7qP3V9bDRyXCLqX7a7sq6DkMeWWAuk',
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );
}

export { supabase };