/*
  # Add roommates management

  1. New Tables
    - `roommates`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `name` (text)
      - `email` (text)
      - `share_percentage` (numeric)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on roommates table
    - Add policies for authenticated users
*/

-- Create roommates table
CREATE TABLE IF NOT EXISTS roommates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  share_percentage numeric NOT NULL CHECK (share_percentage > 0 AND share_percentage <= 100),
  status text NOT NULL CHECK (status IN ('pending', 'active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;

-- Create policies for roommates
CREATE POLICY "Tenants can manage their roommates"
  ON roommates
  FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
  );

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_roommates_updated_at
  BEFORE UPDATE ON roommates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();