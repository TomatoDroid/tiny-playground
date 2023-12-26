<script setup lang="ts">
import { createBirpc } from 'birpc'
import type { FrameFunctions, ParentFunctions } from '../types/rpc'

const play = usePlaygroundStore()
const ui = useUiState()
const iframeEl = ref<HTMLIFrameElement>()
const colorMode = useColorMode()

const rpc = createBirpc<FrameFunctions, ParentFunctions>({
  onNagivate(path) {
    play.previewLocation.fullPath = path
  },
  async onReady() {
    play.status = 'ready'
    syncColorMode()
  },
}, {
  post(payload) {
    iframeEl?.value?.contentWindow?.postMessage({
      source: 'nuxt-playground-parent',
      payload,
    }, '*')
  },
  on(fn) {
    window.addEventListener('message', (event) => {
      if (typeof event.data !== 'object')
        return
      if (event.data.source !== 'nuxt-playground-frame')
        return
      fn(event.data.payload)
    })
  },
})

function syncColorMode() {
  rpc.onColorModeChange.asEvent(colorMode.value)
}

watch(
  colorMode,
  syncColorMode,
  { flush: 'sync' },
)

onMounted(async () =>
  await mountPlayground(play, colorMode.value),
)
</script>

<template>
  <iframe
    v-if="play.previewUrl"
    ref="iframeEl"
    :src="play.previewUrl"
    :class="{
      'pointer-events-none': ui.isPanelDragging,
    }"
    :style="play.status === 'ready' ? '' : 'opacity: 0.001; pointer-events: none;'"
    h-full w-full bg-transparent
    allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
  />
</template>
