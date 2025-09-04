<template>
  <div class="flex justify-center min-h-screen pt-20 bg-stone-50 dark:bg-stone-900 transition-colors">
    <div class="max-w-xl w-full px-6">
      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <!-- Header info -->
      <div class="mb-14">
        <div class="flex items-center justify-between mb-4">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Subject: <span class="font-medium">{{ currentSubject }}</span>
          </p>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Elo: <span class="font-medium">{{ currentElo }}</span>
          </p>
        </div>
        
        <!-- Progress Speed Control -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">Progress Speed:</span>
          <div class="flex rounded-lg bg-stone-200 dark:bg-stone-800 p-1" role="radiogroup">
            <button
              v-for="speed in progressSpeeds"
              :key="speed.value"
              @click="scalingFactor = speed.value"
              :class="[
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                scalingFactor === speed.value
                  ? 'bg-white dark:bg-stone-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              ]"
              :title="speed.description"
              role="radio"
              :aria-checked="scalingFactor === speed.value"
            >
              {{ speed.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state for initial load only -->
      <div v-if="initialLoading" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">Loading exercise...</p>
      </div>

      <!-- Exercise content -->
      <div v-else-if="currentExercise">
        <!-- English sentence -->
        <p class="text-2xl text-gray-700 dark:text-gray-300 font-medium mb-2">
          {{ currentExercise.sentence_en }}
        </p>

        <!-- Pattern focus -->
        <div class="mb-8">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Focus: {{ currentExercise.pattern_focus.join(', ') }}
          </p>
        </div>

        <!-- Answer input -->
        <div class="mt-10">
          <label for="answer" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">{{ currentLanguage!.translationLabel }}</label>
          <div class="mt-2">
            <textarea 
              id="answer"
              v-model="userAnswer"
              :disabled="showFeedback"
              @keydown="handleKeydown"
              rows="4" 
              class="block w-full rounded-md bg-white dark:bg-stone-800 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-stone-300 dark:outline-stone-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-stone-600 dark:focus:outline-stone-400 sm:text-sm/6 disabled:bg-stone-50 dark:disabled:bg-stone-700 disabled:text-gray-500 dark:disabled:text-gray-400"
              placeholder="Type your translation here..."
            ></textarea>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-4 flex justify-end gap-3">
          <button 
            v-if="!showFeedback"
            @click="submitAnswer"
            :disabled="!userAnswer.trim() || submitting"
            type="button" 
            class="rounded-md bg-stone-600 dark:bg-stone-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-500 dark:hover:bg-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 dark:focus-visible:outline-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting">Submitting...</span>
            <span v-else>Submit</span>
          </button>
          
          <button 
            v-else
            @click="nextExercise"
            type="button" 
            class="rounded-md bg-stone-600 dark:bg-stone-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-500 dark:hover:bg-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 dark:focus-visible:outline-stone-400"
          >
            Next Exercise
          </button>
          
          <button 
            @click="goBack"
            type="button" 
            class="rounded-md bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-stone-300 dark:ring-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700"
          >
            Change Subject
          </button>
        </div>

        <!-- Feedback section below buttons -->
        <div v-if="showFeedback" class="mt-6 p-4 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <div class="mb-3">
            <span 
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
              :class="currentExercise.is_correct ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300'"
            >
              {{ currentExercise.is_correct ? 'Correct!' : 'Incorrect' }}
            </span>
          </div>
          
          <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{{ currentExercise.feedback }}</p>
          
          <div v-if="!currentExercise.is_correct" class="mt-3 pt-3 border-t border-stone-200 dark:border-stone-600">
            <p class="text-sm text-gray-600 dark:text-gray-400">Correct answer:</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ currentExercise.correct_answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KataRequest, KataResponse } from '~/types/llm/kata';
import type { Session } from '~/types/session';
import { generateSessionId, generateSessionName, saveSession, getSession } from '~/utils/session';
import { getLanguageByCode, defaultLanguage } from '~/utils/languages';

const route = useRoute();
const router = useRouter();

// State
const currentElo = ref(Number(route.query.elo) || 1000);
const currentSubject = ref(route.query.subject as string || 'Mixed');
const currentLanguageCode = ref(route.query.lang as string || defaultLanguage!.code);
const currentLanguage = computed(() => getLanguageByCode(currentLanguageCode.value) || defaultLanguage);
const currentExercise = ref<KataResponse | null>(null);
const nextExerciseData = ref<KataResponse | null>(null);
const userAnswer = ref('');
const showFeedback = ref(false);
const initialLoading = ref(false);
const submitting = ref(false);
const previousExercises = ref<Array<{
  sentence_en: string;
  pattern_focus: string[];
  was_correct?: boolean;
}>>([]);
const sessionId = ref<string>('');
const scalingFactor = ref(1.0);

// Progress speed options
const progressSpeeds = [
  { label: 'Slow', value: 0.5, description: '+10 ELO per correct answer' },
  { label: 'Normal', value: 1.0, description: '+20 ELO per correct answer' },
  { label: 'Fast', value: 1.5, description: '+30 ELO per correct answer' },
  { label: 'Aggressive', value: 2.0, description: '+40 ELO per correct answer' }
];

// Initialize with first exercise
onMounted(() => {
  initializeSession();
  fetchExercise();
});

// Initialize or load session
const initializeSession = () => {
  const urlSessionId = route.query.session as string;
  
  if (urlSessionId) {
    // Load existing session
    const session = getSession(urlSessionId);
    if (session) {
      sessionId.value = urlSessionId;
      currentElo.value = session.currentElo;
      currentSubject.value = session.subject;
      currentLanguageCode.value = session.targetLanguage || defaultLanguage!.code;
      scalingFactor.value = session.eloScalingFactor || 1.0;
      // Load previous exercises but exclude the last one (for fresh start)
      previousExercises.value = session.previousExercises.slice(0, -1);
      return;
    }
  }
  
  // Create new session
  sessionId.value = generateSessionId();
  
  // Update URL with session ID
  router.replace({
    query: {
      ...route.query,
      session: sessionId.value
    }
  });
};

// Fetch exercise from API
const fetchExercise = async () => {
  initialLoading.value = true;
  try {
    const request: KataRequest = {
      current_elo: currentElo.value,
      target_language: currentLanguageCode.value,
      subject_hint: route.query.subject as string || undefined,
      elo_scaling_factor: scalingFactor.value,
      previous_exercises: previousExercises.value
    };

    const response = await $fetch<KataResponse>('/api/v1/eval', {
      method: 'POST',
      body: request
    });

    currentExercise.value = response;
    currentSubject.value = response.subject;
    currentElo.value = response.elo;
  } catch (error) {
    console.error('Failed to fetch exercise:', error);
  } finally {
    initialLoading.value = false;
  }
};

// Submit answer for evaluation
const submitAnswer = async () => {
  if (!currentExercise.value || !userAnswer.value.trim() || submitting.value) return;

  submitting.value = true;
  try {
    const request: KataRequest = {
      current_elo: currentElo.value,
      target_language: currentLanguageCode.value,
      subject_hint: route.query.subject as string || undefined,
      user_answer: userAnswer.value,
      source_sentence_en: currentExercise.value.sentence_en,
      elo_scaling_factor: scalingFactor.value,
      previous_exercises: previousExercises.value
    };

    const response = await $fetch<KataResponse>('/api/v1/eval', {
      method: 'POST',
      body: request
    });

    // Store the next exercise data but don't update the current exercise yet
    nextExerciseData.value = response;
    currentElo.value = response.elo;
    showFeedback.value = true;
    
    // Update the current exercise to show the evaluation results
    // but keep the same sentence_en
    currentExercise.value = {
      ...currentExercise.value,
      is_correct: response.is_correct,
      feedback: response.feedback,
      correct_answer: response.correct_answer
    };
    
    // Add current exercise to previous exercises (keep last 20)
    previousExercises.value.push({
      sentence_en: currentExercise.value.sentence_en,
      pattern_focus: currentExercise.value.pattern_focus,
      was_correct: response.is_correct || false
    });
    
    // Limit to last 20 exercises to avoid sending too much data
    if (previousExercises.value.length > 20) {
      previousExercises.value = previousExercises.value.slice(-20);
    }
    
    // Save session after each attempt
    const session: Session = {
      id: sessionId.value,
      name: generateSessionName(currentSubject.value),
      subject: currentSubject.value,
      targetLanguage: currentLanguageCode.value,
      currentElo: response.elo,
      eloScalingFactor: scalingFactor.value,
      previousExercises: previousExercises.value,
      lastUpdated: new Date().toISOString(),
      exercisesCompleted: previousExercises.value.length
    };
    saveSession(session);
    
    // Update URL with new ELO
    await router.replace({
      query: {
        ...route.query,
        elo: response.elo.toString(),
        lang: currentLanguageCode.value
      }
    });
  } catch (error) {
    console.error('Failed to submit answer:', error);
  } finally {
    submitting.value = false;
  }
};

// Move to next exercise
const nextExercise = () => {
  if (!nextExerciseData.value) return;
  
  // Now update to the next exercise
  currentExercise.value = nextExerciseData.value;
  currentSubject.value = nextExerciseData.value.subject;
  
  // Reset state for the new exercise
  showFeedback.value = false;
  userAnswer.value = '';
  nextExerciseData.value = null;
};

// Go back to subject selection
const goBack = () => {
  router.push('/');
};

// Handle keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Shift + Enter to submit
  if (event.shiftKey && event.key === 'Enter' && !showFeedback.value) {
    event.preventDefault();
    submitAnswer();
  }
};
</script>
