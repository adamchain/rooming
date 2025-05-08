/*
  # Add tenants and maintenance tables

  1. New Tables
    - `tenants`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `lease_start` (date)
      - `lease_end` (date)
      - `rent_amount` (numeric)
      - `security_deposit` (numeric)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `maintenance_requests`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `tenant_id` (uuid, references tenants, optional)
      - `title` (text)
      - `description` (text)
      - `priority` (text)
      - `status` (text)
      - `estimated_cost` (numeric, optional)
      - `actual_cost` (numeric, optional)
      - `scheduled_date` (date, optional)
      - `completed_date` (date, optional)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  lease_start date NOT NULL,
  lease_end date NOT NULL,
  rent_amount numeric(10,2) NOT NULL,
  security_deposit numeric(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  estimated_cost numeric(10,2),
  actual_cost numeric(10,2),
  scheduled_date date,
  completed_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants
CREATE POLICY "Users can manage their tenants"
  ON tenants
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

-- Create policies for maintenance_requests
CREATE POLICY "Users can manage their maintenance requests"
  ON maintenance_requests
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