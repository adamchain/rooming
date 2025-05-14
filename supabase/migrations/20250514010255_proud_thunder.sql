/*
  # Add landlord account columns to properties table

  1. Changes
    - Add financial columns to properties table
    - Add property analysis columns
    - Add property status tracking
    - Add property management columns

  2. Security
    - Maintain existing RLS policies
*/

-- Add financial columns
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS purchase_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS current_value numeric(10,2),
  ADD COLUMN IF NOT EXISTS monthly_rent numeric(10,2),
  ADD COLUMN IF NOT EXISTS expenses numeric(10,2),
  ADD COLUMN IF NOT EXISTS target_rent numeric(10,2),
  ADD COLUMN IF NOT EXISTS vacancy_rate numeric(5,2),
  ADD COLUMN IF NOT EXISTS cap_rate numeric(5,2);

-- Add property analysis columns
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS property_type text,
  ADD COLUMN IF NOT EXISTS year_built integer,
  ADD COLUMN IF NOT EXISTS square_feet numeric(10,2),
  ADD COLUMN IF NOT EXISTS lot_size numeric(10,2),
  ADD COLUMN IF NOT EXISTS bedrooms integer,
  ADD COLUMN IF NOT EXISTS bathrooms numeric(3,1),
  ADD COLUMN IF NOT EXISTS last_renovation_date date;

-- Add property status tracking
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'vacant', 'maintenance', 'listed')),
  ADD COLUMN IF NOT EXISTS acquisition_date date,
  ADD COLUMN IF NOT EXISTS last_inspection_date date;

-- Add property management columns
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS property_manager_name text,
  ADD COLUMN IF NOT EXISTS property_manager_phone text,
  ADD COLUMN IF NOT EXISTS property_manager_email text,
  ADD COLUMN IF NOT EXISTS management_fee_percentage numeric(5,2),
  ADD COLUMN IF NOT EXISTS insurance_provider text,
  ADD COLUMN IF NOT EXISTS insurance_policy_number text,
  ADD COLUMN IF NOT EXISTS insurance_renewal_date date,
  ADD COLUMN IF NOT EXISTS property_tax_id text,
  ADD COLUMN IF NOT EXISTS annual_property_tax numeric(10,2),
  ADD COLUMN IF NOT EXISTS zoning_code text,
  ADD COLUMN IF NOT EXISTS notes text;