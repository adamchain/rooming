/*
  # Add tenant activity tracking

  1. New Tables
    - `tenant_activities`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `type` (text: payment, maintenance, document, message)
      - `title` (text)
      - `description` (text)
      - `status` (text, optional)
      - `amount` (numeric, optional)
      - `metadata` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for tenants and property managers
    - Add triggers for automatic activity recording
*/

CREATE TABLE IF NOT EXISTS tenant_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('payment', 'maintenance', 'document', 'message')),
  title text NOT NULL,
  description text NOT NULL,
  status text,
  amount numeric(10,2),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tenant_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant_activities
CREATE POLICY "Tenants can view their own activities"
  ON tenant_activities
  FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE auth_id = auth.uid()
    )
  );

-- Create policy for property managers to view activities
CREATE POLICY "Property managers can view tenant activities"
  ON tenant_activities
  FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT t.id FROM tenants t
      JOIN properties p ON t.property_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Create trigger to automatically record activities
CREATE OR REPLACE FUNCTION record_tenant_activity()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO tenant_activities (tenant_id, type, title, description, status, amount, metadata)
    VALUES (
      NEW.tenant_id,
      CASE 
        WHEN TG_TABLE_NAME = 'maintenance_requests' THEN 'maintenance'
        WHEN TG_TABLE_NAME = 'invoices' THEN 'payment'
        WHEN TG_TABLE_NAME = 'documents' THEN 'document'
        ELSE 'message'
      END,
      COALESCE(NEW.title, NEW.name, 'New ' || TG_TABLE_NAME),
      COALESCE(NEW.description, 'Activity recorded'),
      NEW.status,
      CASE 
        WHEN TG_TABLE_NAME = 'invoices' THEN NEW.total
        ELSE NULL
      END,
      jsonb_build_object('source_id', NEW.id, 'source_table', TG_TABLE_NAME)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for relevant tables
CREATE TRIGGER record_maintenance_activity
  AFTER INSERT ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION record_tenant_activity();

CREATE TRIGGER record_invoice_activity
  AFTER INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION record_tenant_activity();

CREATE TRIGGER record_document_activity
  AFTER INSERT ON documents
  FOR EACH ROW
  WHEN (NEW.tenant_id IS NOT NULL)
  EXECUTE FUNCTION record_tenant_activity();