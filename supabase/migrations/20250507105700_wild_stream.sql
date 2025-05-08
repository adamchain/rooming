/*
  # Add maintenance automation tables

  1. New Tables
    - `contractors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `specialties` (text array)
      - `service_area` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `maintenance_diagnoses`
      - `id` (uuid, primary key)
      - `request_id` (uuid, references maintenance_requests)
      - `diagnosis` (text)
      - `severity` (text)
      - `recommended_action` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create contractors table
CREATE TABLE IF NOT EXISTS contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  specialties text[] NOT NULL,
  service_area text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create maintenance_diagnoses table
CREATE TABLE IF NOT EXISTS maintenance_diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  diagnosis text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  recommended_action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_diagnoses ENABLE ROW LEVEL SECURITY;

-- Create policies for contractors
CREATE POLICY "Users can manage their contractors"
  ON contractors
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for maintenance_diagnoses
CREATE POLICY "Users can manage their maintenance diagnoses"
  ON maintenance_diagnoses
  FOR ALL
  TO authenticated
  USING (
    request_id IN (
      SELECT id FROM maintenance_requests WHERE property_id IN (
        SELECT id FROM properties WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    request_id IN (
      SELECT id FROM maintenance_requests WHERE property_id IN (
        SELECT id FROM properties WHERE user_id = auth.uid()
      )
    )
  );