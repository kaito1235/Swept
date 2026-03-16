-- Fake cleaner seed data for development (UK-based)
-- Run after all migrations: psql $DATABASE_URL -f database/seeds/001_fake_cleaners.sql

INSERT INTO users (id, supabase_id, email, name, role, avatar) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'sophie.williams@example.com',  'Sophie Williams',  'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'james.chen@example.com',       'James Chen',       'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'priya.patel@example.com',      'Priya Patel',      'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'tom.robertson@example.com',    'Tom Robertson',    'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005', 'emma.clarke@example.com',      'Emma Clarke',      'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006', 'ali.hassan@example.com',       'Ali Hassan',       'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000007', 'lucy.thompson@example.com',    'Lucy Thompson',    'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000008', 'daniel.murphy@example.com',    'Daniel Murphy',    'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000009', 'sarah.okafor@example.com',     'Sarah Okafor',     'cleaner', NULL),
  ('a1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000010', 'mike.stevens@example.com',     'Mike Stevens',     'cleaner', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cleaner_profiles (user_id, bio, hourly_rate, service_area, service_types, availability, avg_rating, review_count, is_active) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Hi, I''m Sophie! I''ve been cleaning homes across Kensington and Notting Hill for 6 years. I take real pride in leaving every home spotless, and I always bring my own eco-friendly products. Previous clients include several Airbnb superhosts.',
    22.00, 'Kensington, London',
    ARRAY['standard','deep_clean']::service_type[],
    '{"monday":true,"tuesday":true,"wednesday":true,"thursday":false,"friday":true,"saturday":true,"sunday":false}',
    4.8, 12, true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Professional cleaner with 8 years of experience in Shoreditch and East London. Specialise in Airbnb turnovers — I know exactly how to get a flat guest-ready fast. Quick, thorough, and always on time.',
    25.00, 'Shoreditch, London',
    ARRAY['standard','airbnb_turnover']::service_type[],
    '{"monday":true,"tuesday":true,"wednesday":false,"thursday":true,"friday":true,"saturday":true,"sunday":true}',
    4.9, 28, true
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Based in Brixton, covering South London. I offer flexible scheduling and am available most days. Deep cleans are my specialty — I go into every corner. Great with families and pet-friendly homes.',
    18.00, 'Brixton, London',
    ARRAY['standard','deep_clean','move_in_out']::service_type[],
    '{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":false,"sunday":false}',
    4.7, 19, true
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Manchester-based cleaner serving the city centre and surrounding areas. I''ve worked with residential landlords, offices, and student accommodation. Reliable, insured, and always leave a good impression.',
    20.00, 'Manchester City Centre',
    ARRAY['standard','deep_clean','office']::service_type[],
    '{"monday":true,"tuesday":true,"wednesday":true,"thursday":false,"friday":true,"saturday":false,"sunday":false}',
    4.6, 8, true
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'Camden-based Airbnb specialist. I''ve managed turnovers for over 40 different listings and know exactly what guests expect. Laundry service included. Can turn around a 2-bed flat in under 3 hours.',
    28.00, 'Camden, London',
    ARRAY['airbnb_turnover','standard']::service_type[],
    '{"monday":false,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":true,"sunday":true}',
    5.0, 6, true
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'Serving Birmingham and surrounding areas. Friendly, hardworking, and detail-oriented. I specialise in end-of-tenancy and move-in cleans, helping tenants get their deposits back and new tenants start fresh.',
    17.00, 'Birmingham City Centre',
    ARRAY['standard','move_in_out']::service_type[],
    '{"monday":true,"tuesday":true,"wednesday":false,"thursday":true,"friday":true,"saturday":true,"sunday":false}',
    4.5, 14, true
  ),
  (
    'a1000000-0000-0000-0000-000000000007',
    'Premium cleaning service in Chelsea and South Kensington. I work with high-end properties and understand the standard expected. Fully insured, DBS checked, and experienced with post-construction clean-up.',
    32.00, 'Chelsea, London',
    ARRAY['deep_clean','post_construction','standard']::service_type[],
    '{"monday":true,"tuesday":false,"wednesday":true,"thursday":true,"friday":true,"saturday":false,"sunday":false}',
    4.9, 22, true
  ),
  (
    'a1000000-0000-0000-0000-000000000008',
    'Edinburgh-based cleaner with 5 years of experience across residential and commercial properties. I cover the New Town, Old Town, and Leith. Known for being thorough, punctual, and easy to communicate with.',
    19.00, 'Edinburgh New Town',
    ARRAY['standard','deep_clean']::service_type[],
    '{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":false,"saturday":true,"sunday":false}',
    4.8, 11, true
  ),
  (
    'a1000000-0000-0000-0000-000000000009',
    'Hi! I''m Sarah, covering Hackney and the surrounding East London area. I''ve got 7 years of experience and a long list of returning clients. I specialise in Airbnb turnovers and deep cleans. Fully insured.',
    23.00, 'Hackney, London',
    ARRAY['standard','airbnb_turnover','deep_clean']::service_type[],
    '{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":true,"sunday":false}',
    4.7, 31, true
  ),
  (
    'a1000000-0000-0000-0000-000000000010',
    'Bristol-based cleaner serving Clifton, Redland, and the city centre. I work with homeowners and letting agents alike. Office cleans and standard residential cleans are my bread and butter. Always on time.',
    21.00, 'Bristol, Clifton',
    ARRAY['standard','office']::service_type[],
    '{"monday":true,"tuesday":false,"wednesday":true,"thursday":true,"friday":true,"saturday":false,"sunday":false}',
    4.6, 9, true
  )
ON CONFLICT (user_id) DO NOTHING;
