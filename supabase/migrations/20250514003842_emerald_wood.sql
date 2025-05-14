/*
  # Add Asset Advisor Tables

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

    - `property_valuations`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `purchase_price` (numeric)
      - `current_value` (numeric)
      - `monthly_rent` (numeric)
      - `expenses` (numeric)
      - `valuation_date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for property owners
*/

-- Create property_mortgages table
CREATE TABLE IF NOT EXISTS property_mortgages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  balance numeric(10,2) NOT NULL,
  rate numeric(4,2) NOT NULL,
  term integer NOT NULL,
  payment numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_valuations table
CREATE TABLE IF NOT EXISTS property_valuations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  purchase_price numeric(10,2) NOT NULL,
  current_value numeric(10,2) NOT NULL,
  monthly_rent numeric(10,2) NOT NULL,
  expenses numeric(10,2) NOT NULL,
  valuation_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_mortgages ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_valuations ENABLE ROW LEVEL SECURITY;

-- Create policies for property_mortgages
CREATE POLICY "Property owners can manage mortgages"
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

-- Create policies for property_valuations
CREATE POLICY "Property owners can manage valuations"
  ON property_valuations
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

-- Add columns to properties table
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS purchase_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS current_value numeric(10,2),
  ADD COLUMN IF NOT EXISTS monthly_rent numeric(10,2),
  ADD COLUMN IF NOT EXISTS expenses numeric(10,2);