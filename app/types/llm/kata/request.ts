export interface KataRequest {
  current_elo: number;
  target_language: string; // Language code (e.g., 'ja', 'es', 'fr')
  subject_hint?: string;
  user_answer?: string; // Changed from user_answer_ja
  source_sentence_en?: string;
  elo_scaling_factor?: number;
  previous_exercises?: Array<{
    sentence_en: string;
    pattern_focus: string[];
    was_correct?: boolean;
  }>;
}