<script setup lang="ts">
const iframeEl = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()

type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'

const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()

const stream = ref<ReadableStream>()

async function startDevServer() {
  const rawFiles = import.meta.glob(
    [
      '../templates/basic/*.*',
      '!../node_modules/**',
    ],
    {
      as: 'raw',
      eager: true,
    },
  )

  const files = Object.fromEntries(
    Object.entries(rawFiles).map(([path, content]) => {
      return [
        path.replace('../templates/basic/', ''),
        {
          file:
          { contents: content },
        },
      ]
    }),
  )

  const wc = await useWebContainer()

  wc.on('server-ready', (port, url) => {
    status.value = 'ready'
    wcUrl.value = url
  })

  wc.on('error', (err) => {
    status.value = 'error'
    error.value = err
  })

  status.value = 'mount'

  await wc.mount(files)

  status.value = 'install'

  const installProcess = await wc.spawn('pnpm', ['install'])

  stream.value = installProcess.output

  const installExitCode = await installProcess.exit

  if (installExitCode !== 0) {
    status.value = 'error'
    error.value = {
      message: `Unable to run npm install, exit as ${installExitCode}`,
    }
    throw new Error('Unable to run npm install')
  }

  status.value = 'start'
  const process = await wc.spawn('pnpm', ['run', 'dev'])
  stream.value = process.output
}

watchEffect(() => {
  if (wcUrl.value && iframeEl.value)
    iframeEl.value.src = wcUrl.value
})

onMounted(startDevServer)
</script>

<template>
  <div w-full max-h-full grid="~ rows-[2fr_1fr]" of-hidden relative>
    <iframe v-show="status === 'ready'" ref="iframeEl" w-full h-full />
    <div v-if="status !== 'ready'" flex="~ col justify-center items-center" capitalize text-lg>
      <div i-svg-spinners-90-ring-with-bg />
      {{ status }}ing
    </div>
    <TerminalOutput :stream="stream" h="33%" />
  </div>
</template>
