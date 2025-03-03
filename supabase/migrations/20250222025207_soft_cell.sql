/*
  # Initial Schema for DAKSHA Arts Fest

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `team_code` (text, unique)
      - `total_points` (integer)
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text: 'individual', 'dual', 'group')
      - `max_winners` (integer)
      - `created_at` (timestamp)
    
    - `results`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `group_id` (uuid, foreign key)
      - `position` (integer)
      - `points` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  team_code text UNIQUE NOT NULL,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('individual', 'dual', 'group')),
  max_winners integer NOT NULL CHECK (max_winners > 0 AND max_winners <= 3),
  created_at timestamptz DEFAULT now()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position > 0 AND position <= 3),
  points integer NOT NULL CHECK (points >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to groups"
  ON groups FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage groups"
  ON groups FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to events"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage events"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to results"
  ON results FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage results"
  ON results FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update group points
CREATE OR REPLACE FUNCTION update_group_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total points for the affected group
  UPDATE groups
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM results
    WHERE group_id = NEW.group_id
  )
  WHERE id = NEW.group_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update points on result changes
CREATE TRIGGER update_points_on_result_change
AFTER INSERT OR UPDATE OR DELETE ON results
FOR EACH ROW
EXECUTE FUNCTION update_group_points();