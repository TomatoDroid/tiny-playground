<script setup lang="ts">
const { x, y } = useMouse()
</script>

<template>
  <div class="grid grid-cols-[1fr_2fr] h-full">
    <div class="border-r border-base p4">
      Content
      <div class="dark-mode:text-red">
        Hello world! {{ x }}, {{ y }}
      </div>
    </div>
    <ThePlayground />
  </div>
</template>
