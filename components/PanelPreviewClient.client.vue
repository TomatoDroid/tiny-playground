<script setup lang="ts">
const play = usePlaygroundStore()
const ui = useUiState()
const iframeEl = ref<HTMLIFrameElement>()

onMounted(() => mountPlayground(play))
</script>

<template>
  <iframe
    v-if="play.previewUrl"
    ref="iframeEl"
    :src="play.previewUrl"
    w-full h-full bg-transparent
    :class="{
      'pointer-events-none': ui.isPanelDragging,
    }"
    allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
  />
  <div
    v-if="play.status !== 'ready'"
    flex="~ col justify-center items-center"
    capitalize text-lg h-full
  >
    <div i-svg-spinners-90-ring-with-bg />
    {{ play.status }}ing
  </div>
</template>
