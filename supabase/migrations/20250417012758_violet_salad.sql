/*
  # Add documents table for storing uploaded files

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `property_id` (uuid, references properties, optional)
      - `name` (text)
      - `content` (text)
      - `analysis` (text)
      - `document_type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `document_qa_history`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `question` (text)
      - `answer` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own documents
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  analysis text,
  document_type text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_qa_history table
CREATE TABLE IF NOT EXISTS document_qa_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_qa_history ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for document_qa_history
CREATE POLICY "Users can manage their document QA history"
  ON document_qa_history
  FOR ALL
  TO authenticated
  USING (
    document_id IN (
      SELECT id FROM documents WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    document_id IN (
      SELECT id FROM documents WHERE user_id = auth.uid()
    )
  );