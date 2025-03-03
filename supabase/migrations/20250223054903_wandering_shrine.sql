/*
  # Add predefined admin credentials

  1. Changes
    - Add predefined admin user with email and password
    - Set up admin role and permissions
*/

-- Create admin user with predefined credentials
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@daksha.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;