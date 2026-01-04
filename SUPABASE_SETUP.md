# 🗄️ Supabase Setup Instructions

This guide will walk you through setting up Supabase for the BeastFlow application. **You will handle this setup yourself.**

## 📋 Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Basic knowledge of SQL (for creating tables)

---

## 🚀 Step 1: Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `beastflow` (or any name you prefer)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be created

---

## 🔑 Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

3. **Save these values** - you'll need them for the next step

---

## 🗃️ Step 3: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy and paste the following SQL code:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompt_history table
CREATE TABLE IF NOT EXISTS prompt_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  language TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create api_key_usage table (for tracking API key usage limits)
CREATE TABLE IF NOT EXISTS api_key_usage (
  key_index INTEGER PRIMARY KEY,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_history_user_id ON prompt_history(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_history_created_at ON prompt_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_date ON api_key_usage(last_reset_date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we're handling auth in the app)
-- For users table
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- For prompt_history table
CREATE POLICY "Allow all operations on prompt_history" ON prompt_history
  FOR ALL USING (true) WITH CHECK (true);

-- For api_key_usage table
CREATE POLICY "Allow all operations on api_key_usage" ON api_key_usage
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

---

## 👤 Step 4: Create Your First Admin User (Optional)

If you want to create an admin user directly in the database:

1. Go to **SQL Editor** again
2. Run this query (replace `your_username` and `your_password`):

```sql
-- First, you need to hash the password
-- For now, we'll insert a placeholder. The app will hash it properly.
-- You can create an admin user through the app's signup, then manually update it:

-- After creating a user through the app, run this to make them admin:
-- UPDATE users SET is_admin = TRUE WHERE username = 'your_username';
```

**OR** create an admin user through the app signup, then:
1. Go to **Table Editor** → **users**
2. Find your user
3. Click to edit
4. Set `is_admin` to `true`
5. Save

---

## 🔐 Step 5: Configure Environment Variables

### For Local Development:

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add these lines:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

3. Replace:
   - `your-project-id` with your actual Supabase project URL
   - `your-anon-key-here` with your actual anon key from Step 2
   - `your-gemini-api-key-here` with your Google Gemini API key

### For Production (Render.com):

1. In your Render dashboard, go to your project
2. Go to **Environment** tab
3. Add these environment variables:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key-here`
   - `VITE_GEMINI_API_KEY` = `your-gemini-api-key-here`

---

## ✅ Step 6: Verify Setup

1. Start your local development server:
   ```bash
   npm install
   npm run dev
   ```

2. Try to:
   - Sign up a new user
   - Sign in with that user
   - Generate some metadata
   - Check if it appears in history

3. In Supabase dashboard:
   - Go to **Table Editor** → **users** - you should see your user
   - Go to **Table Editor** → **prompt_history** - you should see your prompts

---

## 🔒 Security Notes

⚠️ **Important Security Information:**

1. **Password Storage**: Currently, passwords are hashed using SHA-256 in the browser. For production, consider:
   - Moving authentication to a backend server
   - Using Supabase Auth (built-in authentication)
   - Using bcrypt or Argon2 for password hashing

2. **Row Level Security (RLS)**: The current setup allows all operations. For better security:
   - Implement proper RLS policies
   - Use Supabase Auth for authentication
   - Validate user permissions on the backend

3. **API Keys**: Never commit `.env` files to Git. They're already in `.gitignore`.

---

## 🛠️ Troubleshooting

### Issue: "Invalid API key" error
- **Solution**: Double-check your `VITE_SUPABASE_ANON_KEY` in `.env`
- Make sure there are no extra spaces or quotes

### Issue: "relation does not exist" error
- **Solution**: Make sure you ran the SQL queries from Step 3
- Check the **Table Editor** to see if tables exist

### Issue: Can't sign up/sign in
- **Solution**: 
  - Check browser console for errors
  - Verify Supabase URL and keys are correct
  - Check if RLS policies are set correctly

### Issue: History not saving
- **Solution**:
  - Check if `prompt_history` table exists
  - Verify the user is logged in (check localStorage)
  - Check browser console for errors

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/tables)

---

## 🎯 Quick Reference

**Supabase Dashboard**: `https://app.supabase.com`

**Where to find API keys**: Settings → API

**Where to run SQL**: SQL Editor (left sidebar)

**Where to view data**: Table Editor (left sidebar)

---

**That's it!** Your Supabase setup is complete. The app should now be able to:
- Store user accounts
- Save prompt history
- Display admin panel (for admin users)

If you encounter any issues, check the troubleshooting section above or refer to Supabase documentation.

