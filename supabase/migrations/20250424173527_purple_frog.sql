/*
  # Add tenant invitations

  1. New Tables
    - `tenant_invites`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `name` (text)
      - `phone` (text)
      - `token` (text, unique)
      - `status` (text: pending, accepted, expired)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their invites
*/

CREATE TABLE IF NOT EXISTS tenant_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  token text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tenant_invites ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant_invites
CREATE POLICY "Users can manage their tenant invites"
  ON tenant_invites
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

-- Create index for token lookups
CREATE INDEX tenant_invites_token_idx ON tenant_invites (token);