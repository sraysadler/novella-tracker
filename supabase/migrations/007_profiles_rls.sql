-- 007_profiles_rls.sql
-- Enable RLS on profiles. The table was created with RLS disabled (migration 004)
-- which exposes role data to any anon request. Profiles are only queried after
-- auth.getUser() succeeds, so restricting to the owning user is safe and correct.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_own"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());
