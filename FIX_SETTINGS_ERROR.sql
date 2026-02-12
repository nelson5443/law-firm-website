-- COMPLETE FIX FOR ADMIN SETTINGS ERROR
-- Copy and paste this entire script into Supabase SQL Editor

-- Step 1: Drop all existing policies on settings table
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public update access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public insert to settings" ON settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable insert for all users" ON settings;
DROP POLICY IF EXISTS "Enable update for all users" ON settings;

-- Step 2: Disable RLS temporarily to test
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new permissive policies
CREATE POLICY "Enable all access for settings"
ON settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Step 5: Verify settings table exists and has correct structure
-- If this fails, uncomment and run the CREATE TABLE command below

-- CREATE TABLE IF NOT EXISTS settings (
--     id INTEGER PRIMARY KEY DEFAULT 1,
--     admin_email VARCHAR(255),
--     phone VARCHAR(50),
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );

-- Step 6: Insert default record if it doesn't exist
INSERT INTO settings (id, admin_email, phone) 
VALUES (1, 'admin@yourfirm.com', '+1 (555) 123-4567')
ON CONFLICT (id) DO NOTHING;

-- Step 7: Verify the setup
SELECT * FROM settings;
