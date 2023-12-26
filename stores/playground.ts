import type { WebContainer, WebContainerProcess } from '@webcontainer/api'
import type { Raw } from 'vue'
import type { VirtualFile } from '~/structures/File'

export const PlaygroundStatusOrder = [
  'init',
  'mount',
  'install',
  'start',
  'ready',
] as const

export type PlaygroundStatus = typeof PlaygroundStatusOrder[number] | 'error'

export type PlaygroundStore = ReturnType<typeof usePlaygroundStore>

export const usePlaygroundStore = defineStore('playground', () => {
  const status = ref<PlaygroundStatus>('init')
  const error = shallowRef<{ message: string }>()
  const stream = ref<ReadableStream>()
  const files = shallowRef<Raw<VirtualFile>[]>([])
  const webcontainer = shallowRef<Raw<WebContainer>>()

  const previewLocation = ref({
    origin: '',
    fullPath: '',
  })

  const previewUrl = computed(() => previewLocation.value.origin + previewLocation.value.fullPath)

  const colorMode = useColorMode()

  let processInstall: WebContainerProcess | undefined
  let processDev: WebContainerProcess | undefined

  // Mount the playground on client side
  if (import.meta.client) {
    async function mount() {
      const { templates } = await import('../templates')
      const { files: _files, tree } = await templates.basic({
        nuxtrc: [
          colorMode.value === 'dark'
            ? 'app.head.htmlAttrs.class=dark'
            : '',
        ],
      })

      const wc = await import('@webcontainer/api').then(({ WebContainer }) => WebContainer.boot())

      webcontainer.value = wc

      files.value = _files
      _files.forEach((file) => {
        file.wc = wc
      })

      wc.on('server-ready', async (port, url) => {
        // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
        // We need the main one
        if (port === 3000) {
          previewLocation.value = {
            origin: url,
            fullPath: '/',
          }
        }
      })

      wc.on('error', (err) => {
        status.value = 'error'
        error.value = err
      })

      status.value = 'mount'
      await wc.mount(tree)

      startServer()

      if (import.meta.hot) {
        import.meta.hot.accept(() => {
          killPreviousProcess()
        })
      }
    }

    mount()
  }

  async function startServer() {
    if (!import.meta.client)
      return
    const wc = webcontainer.value!
    killPreviousProcess()

    status.value = 'install'
    processInstall = await wc.spawn('pnpm', ['install'])
    stream.value = processInstall.output

    const installExitCode = await processInstall.exit

    if (installExitCode !== 0) {
      status.value = 'error'
      error.value = {
        message: `Unable to run npm install, exit as ${installExitCode}`,
      }
      throw new Error('Unable to run npm install')
    }

    status.value = 'start'
    processDev = await wc.spawn('pnpm', ['run', 'dev', '--no-qr'])
    stream.value = processDev.output
  }

  async function downloadZip() {
    if (!import.meta.client)
      return
    const wc = webcontainer.value!

    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()

    type Zip = typeof zip

    async function crawFiles(dir: string, zip: Zip) {
      const files = await wc.fs.readdir(dir, { withFileTypes: true })

      await Promise.all(
        files.map(async (file) => {
          if (isFileIgnored(file.name))
            return
          if (file.isFile()) {
            const content = await wc.fs.readFile(`${dir}/${file.name}`, 'utf8')
            zip.file(file.name, content)
          }
          else if (file.isDirectory()) {
            const folder = zip.folder(file.name)!
            return crawFiles(`${dir}/${file.name}`, folder)
          }
        }),
      )
    }
    await crawFiles('.', zip)

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const date = new Date()
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
    const link = document.createElement('a')
    link.href = url
    link.download = `nuxt-playground-${dateString}.zip`
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function killPreviousProcess() {
    processInstall?.kill()
    processDev?.kill()
  }

  return {
    files,
    status,
    error,
    stream,
    previewLocation,
    previewUrl,
    webcontainer,
    restartServer: startServer,
    downloadZip,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlaygroundStore, import.meta.hot))
