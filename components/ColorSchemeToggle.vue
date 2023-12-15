<script setup lang="ts">
const color = useColorMode()

function toggleDark() {
  color.value = color.value === 'dark'
    ? 'light'
    : 'dark'
}
</script>

<template>
  <button
    p2
    rounded
    hover="bg-active"
    @click="toggleDark"
  >
    <div class="i-carbon-sun dark:i-carbon-moon" />
  </button>
</template>
