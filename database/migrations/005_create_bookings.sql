CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

CREATE TABLE bookings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cleaner_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id      UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  scheduled_date   DATE NOT NULL,
  scheduled_time   TIME NOT NULL,
  duration_hours   DECIMAL(4, 1) NOT NULL DEFAULT 2.0,
  service_type     service_type NOT NULL DEFAULT 'standard',
  status           booking_status NOT NULL DEFAULT 'pending',
  notes            TEXT,
  total_price      DECIMAL(10, 2),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_cleaner_id ON bookings(cleaner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
