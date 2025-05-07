/*
  # Add GETTRX merchant accounts

  1. New Tables
    - `merchant_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `merchant_id` (text)
      - `public_key` (text)
      - `secret_key` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their merchant accounts
*/

CREATE TABLE IF NOT EXISTS merchant_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  merchant_id text NOT NULL,
  public_key text NOT NULL,
  secret_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE merchant_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for merchant_accounts
CREATE POLICY "Users can manage their own merchant accounts"
  ON merchant_accounts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());