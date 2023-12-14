<script setup>
import '@unocss/reset/tailwind.css'
import 'splitpanes/dist/splitpanes.css'
import './styles/override.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.dark {
  color-scheme: dark;
}
body {
  height: 100vh;
  overflow: hidden;
  --uno: bg-base font-sans;
}
</style>
