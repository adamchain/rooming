-- Insert sample properties
INSERT INTO properties (
  id,
  user_id,
  name,
  address,
  purchase_price,
  current_value,
  monthly_rent,
  expenses,
  target_rent,
  vacancy_rate,
  cap_rate,
  property_type,
  year_built,
  square_feet,
  lot_size,
  bedrooms,
  bathrooms,
  status,
  acquisition_date
) VALUES
(
  'b5a7d741-f72c-4dc9-9e6a-8a2b62b5c1b3',
  '11111111-1111-1111-1111-111111111111',
  'Sunset Apartments',
  '123 Main Street, San Francisco, CA 94105',
  850000,
  950000,
  5500,
  1200,
  6000,
  5.2,
  6.8,
  'apartment',
  2010,
  2200,
  3000,
  3,
  2.5,
  'active',
  '2022-06-15'
),
(
  'c6b8e852-83dd-5ed0-af7b-9b3c73c6d2c4',
  '11111111-1111-1111-1111-111111111111',
  'Ocean View Condos',
  '456 Beach Road, San Francisco, CA 94121',
  1200000,
  1450000,
  7800,
  1800,
  8500,
  4.5,
  7.2,
  'condo',
  2015,
  3000,
  4000,
  4,
  3,
  'active',
  '2021-08-20'
),
(
  'd7c9f963-94ee-6fe1-b88c-0c4d84d7e3d5',
  '11111111-1111-1111-1111-111111111111',
  'Mountain Lodge',
  '789 Pine Street, San Francisco, CA 94108',
  750000,
  920000,
  4800,
  1100,
  5200,
  3.8,
  6.5,
  'single_family',
  2008,
  1800,
  5000,
  3,
  2,
  'active',
  '2023-01-10'
);

-- Insert property mortgages
INSERT INTO property_mortgages (
  property_id,
  balance,
  rate,
  term,
  payment
) VALUES
(
  'b5a7d741-f72c-4dc9-9e6a-8a2b62b5c1b3',
  680000,
  4.25,
  30,
  3342.85
),
(
  'c6b8e852-83dd-5ed0-af7b-9b3c73c6d2c4',
  960000,
  3.875,
  30,
  4512.23
),
(
  'd7c9f963-94ee-6fe1-b88c-0c4d84d7e3d5',
  600000,
  4.125,
  30,
  2907.14
);

-- Insert property valuations
INSERT INTO property_valuations (
  property_id,
  purchase_price,
  current_value,
  monthly_rent,
  expenses,
  valuation_date
) VALUES
(
  'b5a7d741-f72c-4dc9-9e6a-8a2b62b5c1b3',
  850000,
  950000,
  5500,
  1200,
  CURRENT_DATE
),
(
  'c6b8e852-83dd-5ed0-af7b-9b3c73c6d2c4',
  1200000,
  1450000,
  7800,
  1800,
  CURRENT_DATE
),
(
  'd7c9f963-94ee-6fe1-b88c-0c4d84d7e3d5',
  750000,
  920000,
  4800,
  1100,
  CURRENT_DATE
);