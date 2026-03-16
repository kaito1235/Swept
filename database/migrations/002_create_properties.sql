CREATE TABLE properties (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  address       TEXT NOT NULL,
  lat           DECIMAL(10, 8),
  lng           DECIMAL(11, 8),
  bedrooms      SMALLINT NOT NULL DEFAULT 1,
  bathrooms     SMALLINT NOT NULL DEFAULT 1,
  size          DECIMAL(10, 2),
  photos        TEXT[] DEFAULT '{}',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_host_id ON properties(host_id);

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
