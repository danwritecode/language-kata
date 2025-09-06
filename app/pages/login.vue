<template>
  <div class="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors">
    <div class="max-w-md w-full px-6">
      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">Language Drilling</h1>
        <p class="text-stone-600 dark:text-stone-400">Enter your passkey to continue</p>
      </div>

      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="passkey" class="block text-sm font-medium text-stone-900 dark:text-stone-100 mb-2">
            Passkey
          </label>
          <input
            id="passkey"
            v-model="passkey"
            type="password"
            required
            class="block w-full rounded-md bg-white dark:bg-stone-800 px-3 py-2 text-base text-stone-900 dark:text-stone-100 outline outline-1 -outline-offset-1 outline-stone-300 dark:outline-stone-600 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-stone-600 dark:focus:outline-stone-400"
            placeholder="Enter your passkey"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="p-3 rounded-md bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
          <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading || !passkey.trim()"
          class="w-full rounded-md bg-stone-600 dark:bg-stone-700 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-stone-500 dark:hover:bg-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 dark:focus-visible:outline-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Authenticating...</span>
          <span v-else>Continue</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const passkey = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

const login = async () => {
  if (!passkey.value.trim()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        passkey: passkey.value
      }
    })
    
    if (response.success) {
      await router.push('/')
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid passkey'
  } finally {
    loading.value = false
  }
}
</script>
