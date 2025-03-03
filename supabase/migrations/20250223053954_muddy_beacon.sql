/*
  # Add event scheduling and participant information

  1. Changes
    - Add schedule information to events table
      - `stage` (text): The stage/venue where the event takes place
      - `start_time` (timestamptz): When the event starts
    - Add participant information to results table
      - `participant_name` (text): Name of the participant/team member

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS stage text,
ADD COLUMN IF NOT EXISTS start_time timestamptz;

-- Add participant name to results table
ALTER TABLE results 
ADD COLUMN IF NOT EXISTS participant_name text;