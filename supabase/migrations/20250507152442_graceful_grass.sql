/*
  # Add tenant activity tracking

  1. New Tables
    - `tenant_activities`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `type` (text: payment, maintenance, document, message)
      - `title` (text)
      - `description` (text)
      - `status` (text, optional)
      - `amount` (numeric, optional)
      - `metadata` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policies for tenants to view their own activities
*/

CREATE TABLE IF NOT EXISTS tenant_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('payment', 'maintenance', 'document', 'message')),
  title text NOT NULL,
  description text NOT NULL,
  status text,
  amount numeric(10,2),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tenant_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant_activities
CREATE POLICY "Tenants can view their own activities"
  ON tenant_activities
  FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE auth_id = auth.uid()
    )
  );