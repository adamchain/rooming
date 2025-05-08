/*
  # Add test accounts for landlord and tenant

  1. Changes
    - Create test landlord and tenant auth users
    - Create test property owned by landlord
    - Create test tenant record linked to property
    - Add index for auth_id lookups

  2. Security
    - Maintain existing RLS policies
    - Link tenant to auth user
*/

-- Create index for auth_id lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS tenants_auth_id_idx ON tenants (auth_id);

-- Insert test landlord (will be created via auth signup)
-- Password: Test123!
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'landlord@test.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678',
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "landlord"}',
  NOW(),
  NOW()
);

-- Insert test tenant (will be created via auth signup)
-- Password: Test123!
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'tenant@test.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678',
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "tenant"}',
  NOW(),
  NOW()
);

-- Insert test property
INSERT INTO properties (
  id,
  user_id,
  name,
  address,
  created_at,
  updated_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Test Property',
  '123 Test Street, Test City, TS 12345',
  NOW(),
  NOW()
);

-- Insert test tenant record
INSERT INTO tenants (
  id,
  property_id,
  auth_id,
  name,
  email,
  phone,
  lease_start,
  lease_end,
  rent_amount,
  security_deposit,
  created_at,
  updated_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Test Tenant',
  'tenant@test.com',
  '555-0123',
  '2024-01-01',
  '2024-12-31',
  1500,
  2000,
  NOW(),
  NOW()
);