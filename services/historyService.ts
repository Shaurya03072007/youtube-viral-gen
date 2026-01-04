import { supabase } from '../lib/supabase';
import { PromptHistory, YouTubeMetadata } from '../types';

export async function savePromptHistory(
  userId: string,
  prompt: string,
  language: string,
  metadata: YouTubeMetadata
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('prompt_history')
      .insert([
        {
          user_id: userId,
          prompt,
          language,
          metadata
        }
      ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save history' };
  }
}

export async function getPromptHistory(userId: string): Promise<{ history: PromptHistory[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { history: [], error: error.message };
    }

    return { history: (data || []) as PromptHistory[], error: null };
  } catch (err: any) {
    return { history: [], error: err.message || 'Failed to fetch history' };
  }
}

export async function deletePromptHistory(historyId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('prompt_history')
      .delete()
      .eq('id', historyId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete history' };
  }
}

