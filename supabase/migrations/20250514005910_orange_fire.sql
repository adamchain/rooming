/*
  # Add Property Mortgages Table

  1. New Tables
    - `property_mortgages`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `balance` (numeric)
      - `rate` (numeric)
      - `term` (integer)
      - `payment` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on property_mortgages table
    - Add policies for authenticated users to manage their property mortgages
*/

-- Create property mortgages table
CREATE TABLE IF NOT EXISTS property_mortgages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  balance numeric NOT NULL,
  rate numeric NOT NULL,
  term integer NOT NULL,
  payment numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on property_mortgages
ALTER TABLE property_mortgages ENABLE ROW LEVEL SECURITY;

-- Create policy for property_mortgages
CREATE POLICY "Users can manage their property mortgages"
  ON property_mortgages
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