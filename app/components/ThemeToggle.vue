<template>
  <button
    @click="toggleTheme"
    class="text-slate-800 dark:text-slate-200 transition-colors"
    :title="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Icon 
      :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
      class="w-5 h-5"
    />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
