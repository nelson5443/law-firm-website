# Setup Instructions

## Fix Admin Settings Error

The error occurs because the database policies need to be updated. Follow these steps:

### Step 1: Run SQL Commands in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `hkoufjmjbmjqbnojyaww`
3. Click on "SQL Editor" in the left sidebar
4. Copy and paste the following SQL commands:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public update access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public insert to settings" ON settings;

-- Create policies to allow public access
CREATE POLICY "Allow public read access to settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Allow public update access to settings" ON settings
    FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to settings" ON settings
    FOR INSERT WITH CHECK (true);
```

5. Click "Run" to execute the commands

### Step 2: Restart the Server

1. Stop the current server (Ctrl+C in the terminal)
2. Run: `npm start`

### Step 3: Test Admin Settings

1. Open browser: http://localhost:3000/admin
2. Enter admin email and phone number
3. Click "Save Settings"
4. You should see "Settings saved successfully!"

## Troubleshooting

If you still see errors:

1. Check the browser console (F12) for error messages
2. Check the server terminal for error logs
3. Verify your Supabase credentials in `.env` file
4. Make sure the `settings` table exists in Supabase

## Quick Start Server

```bash
npm start
```

The website will be available at:
- Homepage: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Contact Page: http://localhost:3000/pages/contact.html

## Admin Login Credentials

- Username: admin
- Password: admin123
