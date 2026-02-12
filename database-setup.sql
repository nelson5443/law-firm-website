-- Run these SQL commands in your Supabase SQL Editor

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    admin_email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings (run only once)
INSERT INTO settings (id, admin_email, phone) 
VALUES (1, 'admin@yourfirm.com', '+1 (555) 123-4567')
ON CONFLICT (id) DO NOTHING;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public update access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public insert to settings" ON settings;
DROP POLICY IF EXISTS "Allow public insert access to contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public read access to contacts" ON contacts;

-- Create policies to allow public access
CREATE POLICY "Allow public read access to settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Allow public update access to settings" ON settings
    FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to settings" ON settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access to contacts" ON contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to contacts" ON contacts
    FOR SELECT USING (true);