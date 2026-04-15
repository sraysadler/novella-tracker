-- 004_add_profiles.sql
-- Creates the profiles table and role system

-- 1. Role enum
CREATE TYPE user_role AS ENUM ('user', 'editor', 'admin');

-- 2. Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Disable RLS (consistent with project pattern)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 4. Trigger to auto-create a profile row on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Backfill a profiles row for any existing users
INSERT INTO profiles (id, role)
SELECT id, 'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
