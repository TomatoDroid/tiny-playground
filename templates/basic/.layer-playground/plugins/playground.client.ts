import { createBirpc } from 'birpc'
import type { ClientInfo, FrameFunctions, ParentFunctions } from '../../../../types/rpc'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  const runtimeConfig = useRuntimeConfig()

  const functions: FrameFunctions = {
    onColorModeChange(mode: string) {
      document.documentElement.classList.toggle(
        'dark',
        mode === 'dark',
      )
    },
  }

  const rpc = createRpc(functions)

  router.afterEach((to) => {
    rpc.onNagivate(to.fullPath)
  })
  rpc.onReady(toRaw(runtimeConfig.public.clientInfo as ClientInfo))
})

function createRpc(functions: FrameFunctions) {
  return createBirpc<ParentFunctions, FrameFunctions>(functions, {
    post(payload) {
      window.parent.postMessage({
        source: 'nuxt-playground-frame',
        payload,
      }, '*')
    },
    on(fn) {
      window.addEventListener('message', (event) => {
        if (typeof event.data !== 'object')
          return
        if (event.data.source !== 'nuxt-playground-parent')
          return
        fn(event.data.payload)
      })
    },
  })
}
