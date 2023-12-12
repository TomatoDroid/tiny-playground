<script setup>
import '@unocss/reset/tailwind.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.dark-mode {
  color-scheme: dark;
}
body {
  height: 100vh;
  overflow: hidden;
}
</style>
