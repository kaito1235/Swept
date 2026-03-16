ALTER TABLE bookings
  ADD COLUMN confirmation_photos TEXT[] DEFAULT '{}',
  ADD COLUMN confirmed_at TIMESTAMPTZ;
