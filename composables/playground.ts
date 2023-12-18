export function usePlayground() {
  type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'

  const status = ref<Status>('init')
  const error = shallowRef<{ message: string }>()
  const stream = useTerminalStream()

  const previewLocation = ref({
    origin: '',
    fullPath: '',
  })

  const previewUrl = computed(() => previewLocation.value.origin + previewLocation.value.fullPath)

  window.addEventListener('message', (event) => {
    if (event.origin !== previewLocation.value.origin)
      return
    switch (event.data.type) {
      case 'update:path':
        previewLocation.value.fullPath = event.data.path
        break
      default:
        break
    }
  })

  const tree = globFilesToWebContainerFs(
    '../templates/basic/',
    import.meta.glob(
      [
        '../templates/basic/**/*.*',
        '../templates/basic/**/.npmrc',
      ],
      {
        as: 'raw',
        eager: true,
      },
    ),
  )

  async function mount() {
    const wc = await useWebContainer()

    wc.on('server-ready', (port, url) => {
      // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
      // We need the main one
      if (port === 3000) {
        status.value = 'ready'
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

  return {
    previewUrl,
    previewLocation,
    mount,
    stream,
    status,
    error,
  }
}
