export interface KataRequest {
  current_elo: number;
  subject_hint?: string;
  user_answer_ja?: string;
  source_sentence_en?: string;
  elo_scaling_factor?: number;
  previous_exercises?: Array<{
    sentence_en: string;
    pattern_focus: string[];
    was_correct?: boolean;
  }>;
}