/*
  # Fix User Creation Function

  1. Updates
    - Fix handle_new_user function to handle missing metadata gracefully
    - Add better error handling for user profile creation
    - Ensure proper data types and constraints

  2. Security
    - Maintain existing RLS policies
    - Keep secure function execution
*/

-- Drop existing function and recreate with better error handling
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_username text;
  user_country text;
  user_currency text;
BEGIN
  -- Extract metadata with fallbacks
  user_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    'user_' || substr(NEW.id::text, 1, 8)
  );
  
  user_country := COALESCE(
    NEW.raw_user_meta_data->>'country',
    'United States'
  );
  
  user_currency := COALESCE(
    NEW.raw_user_meta_data->>'currency',
    'USD'
  );

  -- Insert profile with error handling
  BEGIN
    INSERT INTO profiles (id, email, username, country, currency)
    VALUES (
      NEW.id,
      NEW.email,
      user_username,
      user_country,
      user_currency
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- If username already exists, append random suffix
      INSERT INTO profiles (id, email, username, country, currency)
      VALUES (
        NEW.id,
        NEW.email,
        user_username || '_' || floor(random() * 1000)::text,
        user_country,
        user_currency
      );
    WHEN OTHERS THEN
      -- Log error and use minimal profile
      INSERT INTO profiles (id, email, username, country, currency)
      VALUES (
        NEW.id,
        NEW.email,
        'user_' || substr(NEW.id::text, 1, 8),
        'United States',
        'USD'
      );
  END;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If all else fails, still return NEW to not block user creation
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure profiles table has proper constraints
DO $$
BEGIN
  -- Add unique constraint on username if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_username_key' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;

  -- Add unique constraint on email if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_email_key' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;