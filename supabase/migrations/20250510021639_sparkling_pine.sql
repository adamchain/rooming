/*
  # Add messages table for tenant-landlord communication

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references auth.users)
      - `receiver_id` (uuid, references auth.users)
      - `content` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policies for message senders and receivers
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users NOT NULL,
  receiver_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can send and receive messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    receiver_id = auth.uid()
  )
  WITH CHECK (
    sender_id = auth.uid()
  );