/*
  # Add test data for tenant dashboard

  1. Add test property services
  2. Add test tenant activities
*/

-- Add test property services
INSERT INTO property_services (property_id, name, description, price, website_url)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'Cleaning Service', 'Professional cleaning service for your home', '$150/session', 'https://cleaning.example.com'),
  ('33333333-3333-3333-3333-333333333333', 'Pet Walking', 'Daily dog walking service', '$25/walk', 'https://petwalking.example.com'),
  ('33333333-3333-3333-3333-333333333333', 'Package Acceptance', 'Secure package acceptance and storage', 'Free', 'https://packages.example.com');

-- Add test tenant activities
INSERT INTO tenant_activities (tenant_id, type, title, description, status, amount, created_at)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment', 'Monthly rent payment for May 2024', 'completed', 1500.00, NOW() - INTERVAL '2 days'),
  ('44444444-4444-4444-4444-444444444444', 'maintenance', 'Maintenance Request', 'Reported leaking faucet in kitchen', 'pending', NULL, NOW() - INTERVAL '5 days'),
  ('44444444-4444-4444-4444-444444444444', 'document', 'Document Upload', 'Uploaded renter''s insurance policy', NULL, NULL, NOW() - INTERVAL '7 days'),
  ('44444444-4444-4444-4444-444444444444', 'message', 'Message Sent', 'Contacted property manager about parking', NULL, NULL, NOW() - INTERVAL '10 days');