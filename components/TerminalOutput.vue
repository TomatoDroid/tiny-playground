<script setup lang="ts">
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

const props = defineProps<{
  stream?: ReadableStream
}>()

const root = ref<HTMLDivElement>()

const term = new Terminal()
const fitAddon = new FitAddon()
term.loadAddon(fitAddon)

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
  fitAddon.fit()
})
</script>

<template>
  <div ref="root" />
</template>
