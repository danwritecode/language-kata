<template>
  <div class="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors relative">
    <div class="max-w-xl w-full px-6">
      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Language Drilling</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-12">Practice translations with adaptive difficulty</p>
      </div>

      <div class="space-y-6">
        <!-- New Session Section -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Start New Session</h2>
          <div class="space-y-6">
            <div>
              <label for="language" class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Target Language
              </label>
              <select
                id="language"
                v-model="selectedLanguage"
                class="block w-full rounded-md bg-white dark:bg-stone-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-stone-300 dark:outline-stone-600 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-stone-600 dark:focus:outline-stone-400"
              >
                <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                  {{ lang.name }} ({{ lang.nativeName }})
                </option>
              </select>
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Choose a subject (optional)
              </label>
              <input 
                id="subject"
                v-model="subject"
                type="text" 
                placeholder="e.g., weather, food, daily routine"
                class="block w-full rounded-md bg-white dark:bg-stone-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-stone-300 dark:outline-stone-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-stone-600 dark:focus:outline-stone-400"
              />
              <p class="mt-2 text-sm text-gray-500">Leave empty for mixed topics</p>
            </div>

            <div>
              <label for="elo" class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Starting ELO
              </label>
              <div class="flex items-center gap-4">
                <input 
                  id="elo"
                  v-model.number="startingElo"
                  type="range" 
                  min="500"
                  max="3000"
                  step="100"
                  class="flex-1"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">{{ startingElo }}</span>
              </div>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span v-if="startingElo < 800">Beginner</span>
                <span v-else-if="startingElo < 1400">Intermediate</span>
                <span v-else-if="startingElo < 2000">Upper Intermediate</span>
                <span v-else-if="startingElo < 2600">Advanced</span>
                <span v-else>Expert</span>
              </div>
            </div>

            <button 
              @click="startPractice"
              type="button" 
              class="w-full rounded-md bg-stone-600 dark:bg-stone-700 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-stone-500 dark:hover:bg-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 dark:focus-visible:outline-stone-400"
            >
              Start New Practice
            </button>
          </div>
        </div>

        <!-- Saved Sessions Section -->
        <ClientOnly>
          <div v-if="savedSessions.length > 0">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Continue Previous Session</h2>
            <div class="space-y-3">
              <div 
                v-for="session in savedSessions" 
                :key="session.id"
                class="flex items-center justify-between p-4 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                <div class="flex-1 cursor-pointer" @click="continueSession(session)">
                  <div class="flex items-center gap-3">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-gray-100">{{ session.name }}</p>
                      <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>ELO: {{ session.currentElo }}</span>
                        <span>{{ session.exercisesCompleted }} exercises</span>
                        <span>{{ formatRelativeTime(session.lastUpdated) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  @click="deleteSessionConfirm(session.id)"
                  class="ml-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Delete session"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </ClientOnly>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Session } from '~/types/session';
import { getAllSessions, deleteSession } from '~/utils/session';
import { languages, defaultLanguage } from '~/utils/languages';

const subject = ref('');
const startingElo = ref(1000);
const selectedLanguage = ref(defaultLanguage!.code);
const savedSessions = ref<Session[]>([]);
const router = useRouter();

// Load saved sessions on mount
onMounted(() => {
  savedSessions.value = getAllSessions();
});

const startPractice = async () => {
  // Navigate to practice page with subject and language as query params
  await router.push({
    path: '/practice',
    query: {
      subject: subject.value || undefined,
      elo: startingElo.value.toString(),
      lang: selectedLanguage.value
    }
  });
};

const continueSession = async (session: Session) => {
  // Navigate to practice page with session data
  await router.push({
    path: '/practice',
    query: {
      subject: session.subject,
      elo: session.currentElo.toString(),
      lang: session.targetLanguage || defaultLanguage!.code,
      session: session.id
    }
  });
};

const deleteSessionConfirm = (sessionId: string) => {
  if (confirm('Are you sure you want to delete this session?')) {
    deleteSession(sessionId);
    savedSessions.value = getAllSessions();
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};
</script>
