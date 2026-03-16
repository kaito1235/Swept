ALTER TABLE cleaner_profiles
  ADD COLUMN IF NOT EXISTS service_area TEXT;

CREATE INDEX IF NOT EXISTS idx_cleaner_profiles_service_area
  ON cleaner_profiles(service_area);
