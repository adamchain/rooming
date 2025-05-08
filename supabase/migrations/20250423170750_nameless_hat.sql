/*
  # Add contacts management tables

  1. New Tables
    - `contact_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)

    - `contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category_id` (uuid, references contact_categories)
      - `name` (text)
      - `company` (text)
      - `email` (text)
      - `phone` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their contacts
*/

-- Create contact categories table
CREATE TABLE IF NOT EXISTS contact_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  category_id uuid REFERENCES contact_categories(id),
  name text NOT NULL,
  company text,
  email text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_categories
CREATE POLICY "Anyone can view contact categories"
  ON contact_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for contacts
CREATE POLICY "Users can manage their own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Insert default contact categories
INSERT INTO contact_categories (name, description) VALUES
  ('Contractor', 'Service providers and maintenance contractors'),
  ('Realtor', 'Real estate agents and brokers'),
  ('Property Manager', 'Property management professionals'),
  ('Insurance Agent', 'Insurance providers and agents'),
  ('Legal', 'Attorneys and legal professionals'),
  ('Financial', 'Accountants, tax advisors, and financial professionals'),
  ('Vendor', 'Service and product suppliers'),
  ('Other', 'Other business contacts');