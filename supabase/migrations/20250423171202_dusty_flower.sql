/*
  # Add contact support to invoices table

  1. Changes
    - Make tenant_id and property_id optional in invoices table
    - Add contact_id column to invoices table
    - Update RLS policies to handle contact invoices

  2. Security
    - Maintain existing RLS policies
    - Add new policy for contact-based invoices
*/

-- Modify invoices table to make tenant_id and property_id optional
ALTER TABLE invoices
  ALTER COLUMN tenant_id DROP NOT NULL,
  ALTER COLUMN property_id DROP NOT NULL;

-- Add contact_id column
ALTER TABLE invoices
  ADD COLUMN contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE;

-- Drop existing RLS policy
DROP POLICY IF EXISTS "Users can manage their invoices" ON invoices;

-- Create updated RLS policy for invoices
CREATE POLICY "Users can manage their invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (
    (property_id IS NULL AND contact_id IN (
      SELECT id FROM contacts WHERE user_id = auth.uid()
    ))
    OR
    (property_id IN (
      SELECT id FROM properties WHERE user_id = auth.uid()
    ))
  )
  WITH CHECK (
    (property_id IS NULL AND contact_id IN (
      SELECT id FROM contacts WHERE user_id = auth.uid()
    ))
    OR
    (property_id IN (
      SELECT id FROM properties WHERE user_id = auth.uid()
    ))
  );