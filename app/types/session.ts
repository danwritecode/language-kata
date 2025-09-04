export interface Session {
  id: string;
  name: string;
  subject: string;
  targetLanguage: string; // Language code (e.g., 'ja', 'es', 'fr')
  currentElo: number;
  eloScalingFactor: number;
  previousExercises: Array<{
    sentence_en: string;
    pattern_focus: string[];
    was_correct?: boolean;
  }>;
  lastUpdated: string;
  exercisesCompleted: number;
}