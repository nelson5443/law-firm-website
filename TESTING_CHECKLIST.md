# Testing Checklist

After running the SQL fix, test these features:

## ✅ Admin Panel Tests

### 1. Access Admin Panel
- [ ] Go to http://localhost:3000/admin
- [ ] Page loads without errors
- [ ] You see "Admin Dashboard" heading

### 2. Save Settings
- [ ] Enter email: test@lawfirm.com
- [ ] Enter phone: +1 (555) 999-8888
- [ ] Click "Save Settings"
- [ ] See green success message: "✓ Settings saved successfully!"
- [ ] Refresh page - settings should still be there

### 3. View Contacts
- [ ] Click "Refresh Messages" button
- [ ] Should see "No contact messages yet" or list of contacts

## ✅ Contact Form Tests

### 1. Submit Contact Form
- [ ] Go to http://localhost:3000/pages/contact.html
- [ ] Fill in all fields
- [ ] Click Submit
- [ ] See success message

### 2. Verify in Admin
- [ ] Go back to admin panel
- [ ] Click "Refresh Messages"
- [ ] Your test message should appear in the table

## 🔧 If Something Fails

### Error: "Cannot GET /admin"
- Server is not running
- Run: `npm start`

### Error: "Error saving settings"
- Run the SQL fix in Supabase (see QUICK_FIX.md)
- Check browser console (F12) for details

### Error: "Network error"
- Server crashed
- Check terminal for error messages
- Restart: `npm start`

## 📝 Server Should Show

When server starts successfully, you should see:
```
✅ Heritage Law Chambers running on http://localhost:3000
📧 Resend API configured
🗄️  Supabase connected
👤 Admin login: username=admin, password=admin123
```

## 🎯 All Working?

If all tests pass, your law firm website is ready! 

Next steps:
- Customize the content
- Add your law firm's branding
- Deploy to production
