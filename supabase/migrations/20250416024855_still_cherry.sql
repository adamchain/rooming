/*
  # Property Management Schema Setup

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `feature_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)

    - `property_features`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `name` (text)
      - `category` (uuid, references feature_categories)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their properties and features
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for properties
CREATE POLICY "Users can manage their own properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create feature categories table
CREATE TABLE IF NOT EXISTS feature_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create property features table
CREATE TABLE IF NOT EXISTS property_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  category uuid REFERENCES feature_categories(id),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feature_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;

-- Create policies for feature_categories
CREATE POLICY "Anyone can view feature categories"
  ON feature_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for property_features
CREATE POLICY "Users can manage their property features"
  ON property_features
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

-- Insert default feature categories
INSERT INTO feature_categories (name, description) VALUES
  ('Interior', 'Features inside the property'),
  ('Exterior', 'Features outside the property'),
  ('Appliances', 'Major appliances included'),
  ('Systems', 'Property systems and infrastructure'),
  ('Security', 'Security and safety features'),
  ('Amenities', 'Additional property amenities'),
  ('Accessibility', 'Accessibility features'),
  ('Energy', 'Energy efficiency features'),
  ('Smart Home', 'Smart home technology features'),
  ('Parking', 'Parking and garage features');