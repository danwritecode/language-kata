<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// This layout will be used for authenticated pages
// Auth checking will be handled by the composable
const { checkAuth } = useAuth()

// Check authentication on mount
onMounted(async () => {
  await checkAuth()
})
</script>