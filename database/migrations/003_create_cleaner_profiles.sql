CREATE TYPE service_type AS ENUM (
  'standard',
  'deep_clean',
  'move_in_out',
  'airbnb_turnover',
  'office',
  'post_construction'
);

CREATE TABLE cleaner_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio             TEXT,
  hourly_rate     DECIMAL(8, 2),
  service_radius  INTEGER,
  service_types   service_type[] DEFAULT '{}',
  availability    JSONB DEFAULT '{}',
  photos          TEXT[] DEFAULT '{}',
  avg_rating      DECIMAL(3, 2) DEFAULT 0.00,
  review_count    INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cleaner_profiles_user_id ON cleaner_profiles(user_id);
CREATE INDEX idx_cleaner_profiles_hourly_rate ON cleaner_profiles(hourly_rate);
CREATE INDEX idx_cleaner_profiles_avg_rating ON cleaner_profiles(avg_rating);

CREATE TRIGGER update_cleaner_profiles_updated_at
  BEFORE UPDATE ON cleaner_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
