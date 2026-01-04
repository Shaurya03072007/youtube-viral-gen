import { supabase } from '../lib/supabase';

const MAX_USES_PER_KEY = 19;

interface ApiKeyUsage {
  key_index: number;
  usage_count: number;
  last_reset_date: string;
}

// Get all API keys from environment variables
// Format: VITE_GEMINI_API_KEY_1, VITE_GEMINI_API_KEY_2, etc.
function getAllApiKeys(): string[] {
  const keys: string[] = [];
  let index = 1;
  
  while (true) {
    const key = import.meta.env[`VITE_GEMINI_API_KEY_${index}`] || '';
    if (!key) break;
    keys.push(key);
    index++;
  }
  
  // Also check for single key (backward compatibility)
  if (keys.length === 0) {
    const singleKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (singleKey) keys.push(singleKey);
  }
  
  return keys;
}

// Get today's date string (YYYY-MM-DD)
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get or initialize key usage from Supabase
async function getKeyUsage(): Promise<ApiKeyUsage[]> {
  try {
    const { data, error } = await supabase
      .from('api_key_usage')
      .select('*')
      .order('key_index', { ascending: true });

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching key usage:', error);
      return [];
    }

    const today = getTodayDateString();
    const allKeys = getAllApiKeys();
    
    // If no data exists or date changed, reset all counts
    if (!data || data.length === 0 || (data[0] && data[0].last_reset_date !== today)) {
      // Reset all keys for new day
      await resetAllKeys(today);
      return allKeys.map((_, index) => ({
        key_index: index + 1,
        usage_count: 0,
        last_reset_date: today
      }));
    }

    // Ensure we have entries for all keys
    const usageMap = new Map(data.map((item: any) => [item.key_index, item]));
    const result: ApiKeyUsage[] = [];
    
    for (let i = 0; i < allKeys.length; i++) {
      const index = i + 1;
      if (usageMap.has(index)) {
        const item = usageMap.get(index);
        // Reset if date changed
        if (item.last_reset_date !== today) {
          result.push({
            key_index: index,
            usage_count: 0,
            last_reset_date: today
          });
        } else {
          result.push({
            key_index: index,
            usage_count: item.usage_count || 0,
            last_reset_date: item.last_reset_date || today
          });
        }
      } else {
        result.push({
          key_index: index,
          usage_count: 0,
          last_reset_date: today
        });
      }
    }
    
    return result;
  } catch (err) {
    console.error('Error in getKeyUsage:', err);
    return [];
  }
}

// Reset all keys (for new day)
async function resetAllKeys(date: string): Promise<void> {
  const allKeys = getAllApiKeys();
  
  // Delete all existing entries
  await supabase.from('api_key_usage').delete().neq('key_index', -1);
  
  // Insert fresh entries
  const entries = allKeys.map((_, index) => ({
    key_index: index + 1,
    usage_count: 0,
    last_reset_date: date
  }));
  
  if (entries.length > 0) {
    await supabase.from('api_key_usage').insert(entries);
  }
}

// Increment usage count for a key
async function incrementKeyUsage(keyIndex: number): Promise<void> {
  const today = getTodayDateString();
  
  try {
    // Try to update existing record
    const { data: existing } = await supabase
      .from('api_key_usage')
      .select('*')
      .eq('key_index', keyIndex)
      .single();

    if (existing) {
      // Check if date changed, reset if so
      if (existing.last_reset_date !== today) {
        await supabase
          .from('api_key_usage')
          .update({
            usage_count: 1,
            last_reset_date: today
          })
          .eq('key_index', keyIndex);
      } else {
        await supabase
          .from('api_key_usage')
          .update({
            usage_count: (existing.usage_count || 0) + 1
          })
          .eq('key_index', keyIndex);
      }
    } else {
      // Insert new record
      await supabase
        .from('api_key_usage')
        .insert({
          key_index: keyIndex,
          usage_count: 1,
          last_reset_date: today
        });
    }
  } catch (err) {
    console.error('Error incrementing key usage:', err);
  }
}

// Get the next available API key
export async function getNextAvailableKey(): Promise<{ key: string; keyIndex: number } | null> {
  const allKeys = getAllApiKeys();
  
  if (allKeys.length === 0) {
    throw new Error('No API keys configured. Please set VITE_GEMINI_API_KEY_1, VITE_GEMINI_API_KEY_2, etc.');
  }

  const usage = await getKeyUsage();
  
  // Find first key with usage < MAX_USES_PER_KEY
  for (let i = 0; i < allKeys.length; i++) {
    const keyIndex = i + 1;
    const keyUsage = usage.find(u => u.key_index === keyIndex);
    const count = keyUsage?.usage_count || 0;
    
    if (count < MAX_USES_PER_KEY) {
      return {
        key: allKeys[i],
        keyIndex: keyIndex
      };
    }
  }
  
  // All keys exhausted
  return null;
}

// Record that a key was used
export async function recordKeyUsage(keyIndex: number): Promise<void> {
  await incrementKeyUsage(keyIndex);
}

// Check if all keys are exhausted
export async function areAllKeysExhausted(): Promise<boolean> {
  const allKeys = getAllApiKeys();
  if (allKeys.length === 0) return true;
  
  const usage = await getKeyUsage();
  const today = getTodayDateString();
  
  // Check if all keys have reached max usage today
  for (let i = 0; i < allKeys.length; i++) {
    const keyIndex = i + 1;
    const keyUsage = usage.find(u => u.key_index === keyIndex);
    const count = keyUsage?.usage_count || 0;
    const lastReset = keyUsage?.last_reset_date || today;
    
    // If date changed, this key is available
    if (lastReset !== today) return false;
    
    // If this key hasn't reached max, not all exhausted
    if (count < MAX_USES_PER_KEY) return false;
  }
  
  return true;
}

// Get usage statistics (for admin/debugging)
export async function getUsageStats(): Promise<{ keyIndex: number; usage: number; max: number }[]> {
  const allKeys = getAllApiKeys();
  const usage = await getKeyUsage();
  const today = getTodayDateString();
  
  return allKeys.map((_, index) => {
    const keyIndex = index + 1;
    const keyUsage = usage.find(u => u.key_index === keyIndex);
    const lastReset = keyUsage?.last_reset_date || today;
    
    return {
      keyIndex,
      usage: lastReset === today ? (keyUsage?.usage_count || 0) : 0,
      max: MAX_USES_PER_KEY
    };
  });
}

