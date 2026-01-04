# 🔄 API Key Rotation System

## Overview

The app now supports **multiple API keys** with automatic rotation. Each key can be used **19 times per day**, and the system automatically switches to the next available key.

## How It Works

1. **Multiple Keys**: Add as many API keys as you want in `.env`:
   ```
   VITE_GEMINI_API_KEY_1=key1
   VITE_GEMINI_API_KEY_2=key2
   VITE_GEMINI_API_KEY_3=key3
   ```

2. **Usage Tracking**: Each key's usage is tracked in Supabase (`api_key_usage` table)
   - Counts persist across page reloads
   - Automatically resets daily (at midnight UTC)

3. **Automatic Rotation**: 
   - When Key 1 reaches 19 uses → switches to Key 2
   - When Key 2 reaches 19 uses → switches to Key 3
   - And so on...

4. **Daily Limit Message**: When ALL keys are exhausted, users see:
   > **🚫 We're Done for Today**
   > 
   > All API keys have reached their daily limit (19 uses each).
   > Please come back tomorrow for more generations!

## Setup

### 1. Add Keys to `.env`

```env
VITE_GEMINI_API_KEY_1=your-first-key
VITE_GEMINI_API_KEY_2=your-second-key
VITE_GEMINI_API_KEY_3=your-third-key
# Add as many as you need
```

### 2. Create Supabase Table

The `api_key_usage` table is automatically created when you run the SQL from `SUPABASE_SETUP.md`. It tracks:
- `key_index`: Which key (1, 2, 3, etc.)
- `usage_count`: How many times used today
- `last_reset_date`: Date of last reset (for daily reset)

### 3. For Render.com Deployment

Add all your keys as environment variables in Render:
- `VITE_GEMINI_API_KEY_1`
- `VITE_GEMINI_API_KEY_2`
- `VITE_GEMINI_API_KEY_3`
- etc.

## Example Scenarios

### Scenario 1: 3 Keys
- Key 1: 19 uses → exhausted
- Key 2: 19 uses → exhausted  
- Key 3: 5 uses → still available
- **Total available today**: 5 more generations

### Scenario 2: 5 Keys, All Used
- All 5 keys: 19 uses each
- **Result**: "We're Done for Today" message
- **Total used today**: 95 generations

### Scenario 3: Daily Reset
- Yesterday: All keys exhausted
- Today (new day): All keys reset to 0 uses
- **Result**: Full capacity available again

## Technical Details

- **Storage**: Supabase `api_key_usage` table
- **Reset Time**: Midnight UTC (automatically detected by date change)
- **Persistence**: Counts survive page reloads, server restarts
- **Error Handling**: If all keys exhausted, throws `DAILY_LIMIT_REACHED` error

## Monitoring (Future Enhancement)

You can check key usage in Supabase:
```sql
SELECT * FROM api_key_usage ORDER BY key_index;
```

This shows:
- Which keys are exhausted
- How many uses remaining per key
- Last reset date

---

**That's it!** The system automatically handles everything. Just add your keys and it works! 🚀

