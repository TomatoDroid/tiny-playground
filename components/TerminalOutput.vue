<script setup lang="ts">
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'

const props = defineProps<{
  stream?: ReadableStream
}>()

const root = ref<HTMLDivElement>()

const term = new Terminal()

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
})
</script>

<template>
  <div ref="root" />
</template>
