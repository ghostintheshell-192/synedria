-- Change default for is_public_profile to true and update existing profiles
ALTER TABLE profiles ALTER COLUMN is_public_profile SET DEFAULT true;
UPDATE profiles SET is_public_profile = true WHERE is_public_profile = false;
