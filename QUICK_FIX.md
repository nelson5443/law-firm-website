# QUICK FIX FOR "ERROR SAVING SETTINGS"

## The Problem
The Supabase database has Row Level Security (RLS) enabled, which is blocking the settings save operation.

## The Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/hkoufjmjbmjqbnojyaww
2. Click "SQL Editor" in the left menu
3. Click "New Query"

### Step 2: Run This SQL Command
Copy and paste this ENTIRE command and click "Run":

```sql
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public update access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public insert to settings" ON settings;
DROP POLICY IF EXISTS "Enable all access for settings" ON settings;

ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for settings"
ON settings FOR ALL USING (true) WITH CHECK (true);

INSERT INTO settings (id, admin_email, phone) 
VALUES (1, 'admin@yourfirm.com', '+1 (555) 123-4567')
ON CONFLICT (id) DO NOTHING;
```

### Step 3: Restart Your Server
In your terminal:
1. Press `Ctrl+C` to stop the server
2. Run: `npm start`

### Step 4: Test It
1. Open: http://localhost:3000/admin
2. Enter your email and phone
3. Click "Save Settings"
4. You should see "✓ Settings saved successfully!"

## Still Having Issues?

Check the browser console (F12) and look for error messages. The error message will now show you exactly what's wrong.

## Alternative: Disable RLS Completely (Quick Fix)

If you just want to test and don't care about security yet, run this in Supabase SQL Editor:

```sql
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

Then restart the server.
