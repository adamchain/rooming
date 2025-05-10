/*
  # Add Roommates and Rent Splitting

  1. New Tables
    - `roommates`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `name` (text)
      - `email` (text)
      - `share_percentage` (numeric)
      - `status` (text: pending, active)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `rent_splits`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `month` (date)
      - `total_amount` (numeric)
      - `status` (text: pending, completed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `split_payments`
      - `id` (uuid, primary key)
      - `rent_split_id` (uuid, references rent_splits)
      - `roommate_id` (uuid, references roommates)
      - `amount` (numeric)
      - `status` (text: pending, paid)
      - `payment_link` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for tenants to manage their roommates and splits
*/

-- Create roommates table
CREATE TABLE IF NOT EXISTS roommates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  share_percentage numeric NOT NULL CHECK (share_percentage > 0 AND share_percentage <= 100),
  status text NOT NULL CHECK (status IN ('pending', 'active')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rent_splits table
CREATE TABLE IF NOT EXISTS rent_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  month date NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create split_payments table
CREATE TABLE IF NOT EXISTS split_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rent_split_id uuid REFERENCES rent_splits(id) ON DELETE CASCADE,
  roommate_id uuid REFERENCES roommates(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid')),
  payment_link text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for roommates
CREATE POLICY "Tenants can manage their roommates"
  ON roommates
  FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE auth_id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM tenants WHERE auth_id = auth.uid()
    )
  );

-- Create policies for rent_splits
CREATE POLICY "Tenants can manage their rent splits"
  ON rent_splits
  FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE auth_id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM tenants WHERE auth_id = auth.uid()
    )
  );

-- Create policies for split_payments
CREATE POLICY "Users can view and manage their split payments"
  ON split_payments
  FOR ALL
  TO authenticated
  USING (
    rent_split_id IN (
      SELECT id FROM rent_splits WHERE tenant_id IN (
        SELECT id FROM tenants WHERE auth_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    rent_split_id IN (
      SELECT id FROM rent_splits WHERE tenant_id IN (
        SELECT id FROM tenants WHERE auth_id = auth.uid()
      )
    )
  );

-- Create indexes
CREATE INDEX roommates_tenant_id_idx ON roommates (tenant_id);
CREATE INDEX rent_splits_tenant_id_idx ON rent_splits (tenant_id);
CREATE INDEX split_payments_rent_split_id_idx ON split_payments (rent_split_id);
CREATE INDEX split_payments_roommate_id_idx ON split_payments (roommate_id);
CREATE INDEX split_payments_payment_link_idx ON split_payments (payment_link);