/*
  # Add property services table

  1. New Table
    - `property_services`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `name` (text)
      - `description` (text)
      - `price` (text)
      - `website_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for property owners to manage services
    - Add policies for tenants to view services
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Property owners can manage services" ON property_services;
DROP POLICY IF EXISTS "Tenants can view services" ON property_services;

-- Create or update the table
CREATE TABLE IF NOT EXISTS property_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price text NOT NULL,
  website_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Property owners can manage services"
  ON property_services
  FOR ALL
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view services"
  ON property_services
  FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM tenants WHERE auth_id = auth.uid()
    )
  );