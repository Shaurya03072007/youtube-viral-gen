# 🔑 Where to Enter Your API Keys

## 📍 Location: Create a `.env` file in the root directory

Create a file named `.env` (with the dot at the beginning) in the same folder as `package.json`.

**File location:**
```
youtube-viral-gen-main/
  ├── .env          ← CREATE THIS FILE HERE
  ├── package.json
  ├── App.tsx
  └── ...
```

## 📝 What to Put in `.env`

Copy this template and fill in your actual keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

## 🔍 Where to Get Each Key

### 1. Supabase Keys (2 keys needed)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project (or create one - see `SUPABASE_SETUP.md`)
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon/public key** → This is your `VITE_SUPABASE_ANON_KEY`

### 2. Google Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create multiple API keys (one at a time)
4. Add them to `.env` as:
   - `VITE_GEMINI_API_KEY_1=first-key-here`
   - `VITE_GEMINI_API_KEY_2=second-key-here`
   - `VITE_GEMINI_API_KEY_3=third-key-here`
   - etc.

**Example:** If you have 5 keys, you can generate 5 × 19 = 95 metadata generations per day!

## ✅ Example `.env` File

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
VITE_GEMINI_API_KEY_1=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
VITE_GEMINI_API_KEY_2=AIzaSyXyZAbCdEfGhIjKlMnOpQrStUvWxYz7654321
VITE_GEMINI_API_KEY_3=AIzaSyAnotherKeyHereForMoreGenerations
```

## ⚠️ Important Notes

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **No spaces** around the `=` sign
3. **No quotes** needed around the values
4. **Restart your dev server** after creating/updating `.env`:
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```

## 🚀 For Production (Render.com)

When deploying to Render.com, add these same variables in:
- **Render Dashboard** → Your Project → **Environment** tab
- Add each variable one by one
- **Important**: Use the same variable names (`VITE_SUPABASE_URL`, etc.)

## 🧪 Test if Keys Are Working

After creating `.env` and restarting the server:

1. Try to sign up a new user
2. If Supabase keys are wrong → You'll see an error when trying to sign up
3. If Gemini keys are wrong → You'll see an error when generating metadata
4. After 19 uses per key, the system will automatically switch to the next key
5. When all keys are exhausted, you'll see "We're Done for Today" message

## 🔄 How Key Rotation Works

- Each API key can be used **19 times per day**
- The system automatically rotates to the next key when one is exhausted
- Usage counts reset daily (at midnight UTC)
- All usage is tracked in Supabase and persists across page reloads
- When all keys reach 19 uses, users see: **"We're Done for Today"**

---

**That's it!** Once you create the `.env` file with your keys, the app will automatically use them.

