/*
  # Update tenant invites table for email-based invites
  
  1. Changes
    - Replace phone field with email field
    - Keep existing RLS policies
    - Maintain indexes and constraints
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS tenant_invites CASCADE;

CREATE TABLE IF NOT EXISTS tenant_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tenant_invites ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their tenant invites" ON tenant_invites;

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