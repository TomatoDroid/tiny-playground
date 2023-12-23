<script setup lang="ts">
if (process.client) {
  const route = useRoute()
  watch(
    () => route.fullPath,
    (newFullPath) => {
      window.parent.postMessage({
        type: 'update:path',
        path: newFullPath,
      }, '*')
    },
    { immediate: true },
  )
}
</script>

<template>
  <NuxtPage />
</template>
