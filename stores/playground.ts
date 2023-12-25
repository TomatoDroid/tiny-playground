import type { WebContainer } from '@webcontainer/api'
import type { ShallowRef, UnwrapNestedRefs } from 'vue'
import type { VirtualFile } from '~/structures/File'

export const PlaygroundStatusOrder = [
  'init',
  'mount',
  'install',
  'start',
  'ready',
] as const

export type PlaygroundStatus = typeof PlaygroundStatusOrder[number] | 'error'

export interface PlaygroundStateRaw {
  files: ShallowRef<VirtualFile[]>
  status: PlaygroundStatus
  error: { message: string } | undefined
  stream: ReadableStream | undefined
  previewLocation: Ref<{
    origin: string
    fullPath: string
  }>
  previewUrl: ComputedRef<string>
  webcontainer: ShallowRef<WebContainer | undefined>
  actions: PlaygroundActions
}

export interface PlaygroundActions {
  restartServer(): Promise<void>
}

export type PlaygroundState = UnwrapNestedRefs<PlaygroundStateRaw>

export const usePlaygroundStore = defineStore('playground', (): PlaygroundStateRaw => {
  const previewLocation = ref({
    origin: '',
    fullPath: '',
  })

  const previewUrl = computed(() => previewLocation.value.origin + previewLocation.value.fullPath)

  // Actions that will be replaced later on
  const actions: PlaygroundActions = {
    async restartServer() {},
  }

  return {
    files: shallowRef([]),
    status: 'init',
    error: undefined,
    stream: undefined,
    previewLocation,
    previewUrl,
    webcontainer: shallowRef(undefined),
    actions,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlaygroundStore, import.meta.hot))
