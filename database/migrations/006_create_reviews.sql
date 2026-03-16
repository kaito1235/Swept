CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  host_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cleaner_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_cleaner_id ON reviews(cleaner_id);
CREATE INDEX idx_reviews_host_id ON reviews(host_id);

-- Keep avg_rating and review_count in sync automatically
CREATE OR REPLACE FUNCTION update_cleaner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cleaner_profiles
  SET
    avg_rating   = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE cleaner_id = NEW.cleaner_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE cleaner_id = NEW.cleaner_id)
  WHERE user_id = NEW.cleaner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_cleaner_rating
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_cleaner_rating();
