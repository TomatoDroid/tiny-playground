<script setup lang="ts">
const color = useColorMode()

function toggleDark() {
  color.preference = color.value === 'dark'
    ? 'light'
    : 'dark'
}
</script>

<template>
  <button

    rounded p2
    hover="bg-active"
    @click="toggleDark"
  >
    <div i-ph-sun-dim-duotone dark:i-ph-moon-stars-duotone text-2xl />
  </button>
</template>
