/*
  # Set up admin authentication

  1. Changes
    - Create admin role and permissions
    - Set up email authentication policy
*/

-- Enable email authentication
CREATE POLICY "Enable email auth" ON auth.users
  FOR SELECT
  USING (true);

-- Create admin role
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'admin'
  ) THEN
    CREATE ROLE admin;
  END IF;
END $$;

-- Grant necessary permissions to admin role
GRANT USAGE ON SCHEMA public TO admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;