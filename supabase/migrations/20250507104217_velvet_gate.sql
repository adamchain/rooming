/*
  # Add Split Payments Support

  1. New Tables
    - `payment_splits`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, references invoices)
      - `amount` (numeric)
      - `contributors` (jsonb array of contributors)
      - `status` (text: pending, completed)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `split_contributions`
      - `id` (uuid, primary key)
      - `split_id` (uuid, references payment_splits)
      - `name` (text)
      - `email` (text)
      - `amount` (numeric)
      - `status` (text: pending, paid)
      - `payment_link` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create payment_splits table
CREATE TABLE IF NOT EXISTS payment_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  contributors jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL CHECK (status IN ('pending', 'completed')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create split_contributions table
CREATE TABLE IF NOT EXISTS split_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id uuid REFERENCES payment_splits(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid')),
  payment_link text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_contributions ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_splits
CREATE POLICY "Users can view their payment splits"
  ON payment_splits
  FOR SELECT
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE tenant_id IN (
        SELECT id FROM tenants WHERE auth_id = auth.uid()
      )
    )
  );

-- Create policies for split_contributions
CREATE POLICY "Users can view their split contributions"
  ON split_contributions
  FOR SELECT
  TO authenticated
  USING (
    split_id IN (
      SELECT id FROM payment_splits WHERE invoice_id IN (
        SELECT id FROM invoices WHERE tenant_id IN (
          SELECT id FROM tenants WHERE auth_id = auth.uid()
        )
      )
    )
  );

-- Create index for payment links
CREATE INDEX split_contributions_payment_link_idx ON split_contributions (payment_link);