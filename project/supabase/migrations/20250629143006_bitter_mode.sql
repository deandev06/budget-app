/*
  # Clear existing data and fix budget system

  1. Clear all existing transaction and budget data
  2. Reset user balances to start fresh
  3. Fix budget system to properly track spending
  4. Ensure proper database structure for budget updates
*/

-- Clear all existing transaction data
DELETE FROM transactions;

-- Clear all existing budget data
DELETE FROM budgets;

-- Clear all existing savings goals data
DELETE FROM savings_goals;

-- Reset user settings to defaults
UPDATE user_settings SET 
  monthly_income = 0,
  salary_day = 1,
  budget_period_start = DATE_TRUNC('month', CURRENT_DATE);

-- Ensure budgets table has correct structure
DO $$
BEGIN
  -- Add limit_amount column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'limit_amount'
  ) THEN
    ALTER TABLE budgets ADD COLUMN limit_amount DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- Remove old limit column if it exists (using quotes because limit is a reserved keyword)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'limit'
  ) THEN
    ALTER TABLE budgets DROP COLUMN "limit";
  END IF;
END $$;

-- Create user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  monthly_income DECIMAL(10,2) DEFAULT 0,
  salary_day INTEGER DEFAULT 1 CHECK (salary_day >= 1 AND salary_day <= 31),
  budget_period_start DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_settings' AND policyname = 'Users can manage own settings'
  ) THEN
    CREATE POLICY "Users can manage own settings"
      ON user_settings
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_settings updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_user_settings_updated_at
      BEFORE UPDATE ON user_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Ensure all existing users have user_settings
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Create default user settings if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM user_settings WHERE user_id = user_record.id
    ) THEN
      INSERT INTO user_settings (user_id, monthly_income, salary_day, budget_period_start)
      VALUES (
        user_record.id,
        0,
        1,
        DATE_TRUNC('month', CURRENT_DATE)
      );
    END IF;
  END LOOP;
END $$;