# 🚀 BeastFlow: YouTube Meta-Studio

This app is engineered for viral growth with user authentication, history tracking, and mobile-first design.

## ✨ New Features

*   **User Authentication**: Secure login/signup system
*   **Prompt History**: View and manage all your previous prompts (like ChatGPT)
*   **Admin Panel**: View all users and manage accounts
*   **Mobile-First Design**: Optimized for phones and tablets
*   **Supabase Integration**: Cloud database for data persistence
*   **Unique Descriptions**: Each prompt generates unique, non-revertible metadata

## 🗄️ Supabase Setup (REQUIRED)

**Before running the app, you MUST set up Supabase.** 

📖 **See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.**

Quick steps:
1. Create a Supabase project
2. Run the SQL queries to create tables
3. Get your API keys
4. Add them to `.env` file

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_GEMINI_API_KEY_1=your-first-gemini-api-key-here
   VITE_GEMINI_API_KEY_2=your-second-gemini-api-key-here
   # Add more keys as needed (each can be used 19 times per day)
   ```
   
   **Note**: You can add multiple API keys! Each key allows 19 generations per day. See `API_KEY_ROTATION_GUIDE.md` for details.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🚀 Deployment to Render.com

1. **Push to GitHub**: Push this entire project folder to a new GitHub repository.

2. **Create Static Site**:
   *   Log into [Render Dashboard](https://dashboard.render.com).
   *   Click **New +** > **Static Site**.
   *   Connect your GitHub repository.

3. **Build Settings**:
   *   **Build Command**: `npm install && npm run build`
   *   **Publish Directory**: `dist`

4. **Environment Variables (CRITICAL)**:
   *   Go to the **Environment** tab in your Render project.
   *   Add these variables:
       *   `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
       *   `VITE_SUPABASE_ANON_KEY` = `your-anon-key-here`
       *   `VITE_GEMINI_API_KEY_1` = `your-first-gemini-api-key-here`
       *   `VITE_GEMINI_API_KEY_2` = `your-second-gemini-api-key-here`
       *   `VITE_GEMINI_API_KEY_3` = `your-third-gemini-api-key-here`
       *   (Add as many keys as you have - each allows 19 uses per day)
   *   Click **Save**. Render will automatically trigger a new build.

## 💎 Features

*   **Beast-Mode UI**: High-impact dark theme optimized for mobile devices
*   **User Accounts**: Secure authentication with password protection
*   **Prompt History**: Access all your previous generations (ChatGPT-style)
*   **Admin Panel**: View all users (admin access only)
*   **Multi-Language Engine**: Optimized for English, Hindi, Telugu, and more
*   **Deep SEO**: Generates 2000+ character descriptions + 50 viral hashtags
*   **CTR Focused**: Titles designed using high-stakes curiosity gap logic
*   **Mobile-First**: Responsive design prioritizing mobile experience

## 📱 Mobile Optimization

The entire interface is designed mobile-first:
- Touch-friendly buttons and inputs
- Optimized text sizes for small screens
- Responsive layouts that stack on mobile
- Fast loading and smooth animations

## 🔐 Security Notes

- Passwords are hashed before storage
- Users must remember their passwords (no recovery system)
- Admin users can view all user accounts
- Each description is unique and cannot be reverted

## 📚 Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**: Complete Supabase setup guide
- See code comments for implementation details

---
*Built for algorithmic dominance.*