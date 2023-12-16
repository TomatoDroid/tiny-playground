<script setup lang="ts">
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

const props = defineProps<{
  stream?: ReadableStream
}>()

const root = ref<HTMLDivElement>()

const term = new Terminal({
  customGlyphs: true,
  lineHeight: 0.9,
})
const fitAddon = new FitAddon()
term.loadAddon(fitAddon)

useResizeObserver(root, useDebounceFn(() => fitAddon.fit(), 200))

watch(
  () => props.stream,
  (s) => {
    if (!s)
      return
    const reader = s.getReader()
    function read() {
      reader.read().then(({ done, value }) => {
        term.write(value)
        if (!done)
          read()
      })
    }
    read()
  },
  {
    immediate: true,
    flush: 'sync',
  },
)

onMounted(() => {
  term.open(root.value!)
  term.write('\n')
  fitAddon.fit()
})
</script>

<template>
  <div ref="root" h-full w-full />
</template>
