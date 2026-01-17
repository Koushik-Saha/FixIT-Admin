-- Run this in Supabase SQL Editor to make admin2@fixit.com an admin
-- Go to: https://supabase.com/dashboard/project/yosfbftpzfxmrwouevix/sql/new

-- Update the role for the newly registered user
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin2@fixit.com';

-- Verify the update
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE email = 'admin2@fixit.com';

-- If the profile doesn't exist, create it
INSERT INTO profiles (id, email, full_name, role)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  'admin' as role
FROM auth.users
WHERE email = 'admin2@fixit.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.users.id
  );
