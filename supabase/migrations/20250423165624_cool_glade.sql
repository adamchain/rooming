/*
  # Add invoices table for payment tracking

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `property_id` (uuid, references properties)
      - `items` (jsonb array of items with description and amount)
      - `total` (numeric)
      - `due_date` (date)
      - `status` (text: pending, paid, overdue)
      - `payment_link` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]',
  total numeric(10,2) NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'overdue')),
  payment_link text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy for invoices
CREATE POLICY "Users can manage their invoices"
  ON invoices
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

-- Create index for payment links
CREATE INDEX invoices_payment_link_idx ON invoices (payment_link);