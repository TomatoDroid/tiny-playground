<script setup lang="ts">
const playground = useGlobalPlayground()
playground.value = createPlayground()
const { previewLocation, previewUrl, status, mount } = playground.value

const isDragging = usePanelDragging()
const iframeEl = ref<HTMLIFrameElement>()
const inputUrl = ref('')

syncRef(computed(() => previewLocation.value.fullPath), inputUrl, { direction: 'ltr' })

function refreshIframe() {
  if (previewUrl.value && iframeEl.value) {
    iframeEl.value.src = previewUrl.value
    inputUrl.value = previewLocation.value.fullPath
  }
}

function navigate() {
  previewLocation.value.fullPath = inputUrl.value
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement)
    activeElement.blur()
}

onMounted(() => mount())
</script>

<template>
  <div grid="~ cols-[90px_1fr_80px]" px4 border="b base dashed" bg-faded>
    <div flex="~ gap-2 items-center" py2>
      <div i-ph-globe-duotone />
      <span text-sm>Preview</span>
    </div>
    <div flex px-2 py1.5>
      <div
        flex="~ items-center justify-center" mx-auto w-full px2 max-w-100 bg-faded rounded text-sm border="base 1 hover:gray-500/30"
        :class="{
          'pointer-events-none': !previewUrl,
        }"
      >
        <form w-full @submit.prevent="navigate">
          <input v-model="inputUrl" w-full type="text" bg-transparent flex-1 focus:outline-none>
        </form>
        <div flex="~ items-center justify-end">
          <button v-if="previewUrl" mx1 op-75 hover:op-100 @click="refreshIframe">
            <div i-ph-arrow-clockwise-duotone text-sm />
          </button>
        </div>
      </div>
    </div>
  </div>
  <iframe
    v-if="previewUrl"
    ref="iframeEl"
    :src="previewUrl"
    w-full h-full bg-transparent
    :class="{
      'pointer-events-none': isDragging,
    }"
    allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
  />
  <div v-if="status !== 'ready'" flex="~ col justify-center items-center" capitalize text-lg h-full>
    <div i-svg-spinners-90-ring-with-bg />
    {{ status }}ing
  </div>
</template>
