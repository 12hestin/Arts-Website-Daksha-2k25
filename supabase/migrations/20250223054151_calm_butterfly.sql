/*
  # Create initial admin user

  1. Changes
    - Create initial admin user with email/password authentication
    - Set up admin role and permissions
*/

-- Create admin user
SELECT supabase_auth.create_user(
  '{
    "email": "admin@daksha.com",
    "password": "DakshaAdmin2025!",
    "email_confirmed_at": "now()",
    "role": "authenticated"
  }'::jsonb
);