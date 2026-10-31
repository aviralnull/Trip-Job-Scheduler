ALTER TABLE app_users
ADD COLUMN name VARCHAR(160);

ALTER TABLE app_users
ADD COLUMN email VARCHAR(254);

-- Existing users ke liye username ko display name bana do.
UPDATE app_users
SET name = username
WHERE name IS NULL;

-- Existing accounts ke email available nahi hain,
-- isliye email ko abhi nullable rakhenge.
CREATE UNIQUE INDEX uk_app_users_email
ON app_users (LOWER(email))
WHERE email IS NOT NULL;