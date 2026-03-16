ALTER TABLE bookings
  ADD COLUMN stripe_payment_intent_id VARCHAR(255),
  ADD COLUMN payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
  ADD COLUMN platform_fee DECIMAL(10, 2);
