/*
  # Fix RLS policies for database tables

  1. Changes
    - Update RLS policies to allow proper access to tables
    - Add authentication check for insert operations
    - Ensure proper access control for all operations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
    - Maintain public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to manage events" ON events;

-- Create new policies for events table
CREATE POLICY "Enable read access for all users" ON events
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON events
  FOR DELETE
  TO authenticated
  USING (true);