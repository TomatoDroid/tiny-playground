<script setup lang="ts">
// @ts-expect-error missing type
import { Pane, Splitpanes } from 'splitpanes'

const iframeEl = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()

const isDragging = usePanelDragging()
const panelSizeEdit = useLocalStorage('nuxt-playground-panel-edit', 30)
const panelSizeFrame = useLocalStorage('nuxt-playground-panel-frame', 30)

type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'

const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()

const stream = ref<ReadableStream>()

async function startDevServer() {
  const tree = globFilesToWebContainerFs(
    '../templates/basic/',
    import.meta.glob(
      [
        '../templates/basic/**/*.*',
        '!../node_modules/**',
      ],
      {
        as: 'raw',
        eager: true,
      },
    ),
  )

  console.log(tree)

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

  await wc.mount(tree)

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

  // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      process.kill()
    })
  }
}

watchEffect(() => {
  if (wcUrl.value && iframeEl.value)
    iframeEl.value.src = wcUrl.value
})

onMounted(startDevServer)

function start() {
  isDragging.value = true
}

function end(e: { size: number }[]) {
  isDragging.value = false
  panelSizeEdit.value = e[0].size
  panelSizeFrame.value = e[1].size
}
</script>

<template>
  <Splitpanes
    class="of-hidden relative"
    horizontal
    @resize="start"
    @resized="end"
  >
    <Pane :size="panelSizeEdit" min-size="10">
      Edit
    </Pane>
    <Pane :size="panelSizeFrame" min-size="10">
      <iframe
        v-show="status === 'ready'" ref="iframeEl" w-full h-full
        :class="{
          'pointer-events-none': isDragging,
        }"
      />
      <div v-if="status !== 'ready'" flex="~ col justify-center items-center" capitalize text-lg h-full>
        <div i-svg-spinners-90-ring-with-bg />
        {{ status }}ing
      </div>
    </Pane>
    <Pane>
      <TerminalOutput :stream="stream" min-h-0 />
    </Pane>
  </Splitpanes>
</template>
