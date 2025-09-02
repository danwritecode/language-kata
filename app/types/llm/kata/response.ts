export interface KataResponse {
  elo: number;
  subject: string;
  sentence_en: string;
  pattern_focus: string[];
  is_correct: boolean | null;
  feedback: string | null;
  correct_answer_ja: string | null;
}
