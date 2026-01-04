
export interface YouTubeMetadata {
  titles: string[];
  description: string;
  tags: string[];
  thumbnailConcept: string;
  hookIdeas: string[];
  suggestedHashtags: string[];
  pinnedComment: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface User {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  is_admin?: boolean;
}

export interface PromptHistory {
  id: string;
  user_id: string;
  prompt: string;
  language: string;
  metadata: YouTubeMetadata;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password: string; // Hashed password
          email?: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password: string;
          email?: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password?: string;
          email?: string;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      prompt_history: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          language: string;
          metadata: YouTubeMetadata;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          language: string;
          metadata: YouTubeMetadata;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          language?: string;
          metadata?: YouTubeMetadata;
          created_at?: string;
        };
      };
    };
  };
}
