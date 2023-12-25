import { WebContainer, type WebContainerProcess } from '@webcontainer/api'
import { templates } from '~/templates'

if (import.meta.server)
  throw new Error('This file should not be imported on the server')

let _webContainerPromise: Promise<WebContainer>

export async function useWebContainer() {
  if (!_webContainerPromise)
    _webContainerPromise = WebContainer.boot()

  return await _webContainerPromise
}

export async function mountPlayground(
  play: PlaygroundState,
  colorMode: string,
) {
  const { files, tree } = await templates.basic()

  // Inject .nuxtrc so that we can have the color mode on initial load
  if (colorMode === 'dark') {
    tree['.nuxtrc'] = {
      file: {
        contents: `app.head.htmlAttrs.class=dark`,
      },
    }
  }

  const wc = await useWebContainer()

  play.webcontainer = wc

  play.files = files
  play.files.forEach((file) => {
    file.wc = wc
  })

  wc.on('server-ready', async (port, url) => {
    // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
    // We need the main one
    if (port === 3000) {
      play.previewLocation = {
        origin: url,
        fullPath: '/',
      }
    }
  })

  wc.on('error', (err) => {
    play.status = 'error'
    play.error = err
  })

  play.status = 'mount'
  await wc.mount(tree)

  let processInstall: WebContainerProcess | undefined
  let processDev: WebContainerProcess | undefined

  play.actions.restartServer = startServer

  function killPreviousProcess() {
    processInstall?.kill()
    processDev?.kill()
  }

  async function startServer() {
    killPreviousProcess()

    play.status = 'install'
    processInstall = await wc.spawn('pnpm', ['install'])
    play.stream = processInstall.output

    const installExitCode = await processInstall.exit

    if (installExitCode !== 0) {
      play.status = 'error'
      play.error = {
        message: `Unable to run npm install, exit as ${installExitCode}`,
      }
      throw new Error('Unable to run npm install')
    }

    play.status = 'start'
    processDev = await wc.spawn('pnpm', ['run', 'dev'])
    play.stream = processDev.output
  }

  startServer()

  // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      killPreviousProcess()
    })
  }
}
