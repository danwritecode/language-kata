export interface Session {
  id: string;
  name: string;
  subject: string;
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