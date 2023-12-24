<script setup lang="ts">
const play = usePlaygroundStore()
const ui = useUiState()
const iframeEl = ref<HTMLIFrameElement>()
const colorMode = useColorMode()

function onIframeload() {
  syncColorMode()
}

function syncColorMode() {
  iframeEl.value?.contentWindow?.postMessage(
    {
      type: 'color-mode',
      mode: colorMode.value,
    },
    '*',
  )
}

watch(
  colorMode,
  syncColorMode,
  { flush: 'sync' },
)

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
    @load="onIframeload"
  />
</template>
