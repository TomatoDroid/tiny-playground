import type { WebContainer } from '@webcontainer/api'
import type { ShallowRef, UnwrapNestedRefs } from 'vue'
import type { VirtualFile } from '~/structures/File'

export type PlaygroundStatus = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'

export interface PlaygroundStateRaw {
  files: ShallowRef<VirtualFile[]>
  status: PlaygroundStatus
  error: { message: string } | undefined
  stream: ReadableStream | undefined
  previewLocation: {
    origin: string
    fullPath: string
  }
  previewUrl: ComputedRef<string>
  webcontainer: ShallowRef<WebContainer | undefined>
}

export type PlaygroundState = UnwrapNestedRefs<PlaygroundStateRaw>

export const usePlaygroundStore = defineStore('playground', (): PlaygroundStateRaw => {
  const previewLocation = reactive({
    origin: '',
    fullPath: '',
  })

  const previewUrl = computed(() => previewLocation.origin + previewLocation.fullPath)

  return {
    files: shallowRef<VirtualFile[]>([]),
    status: 'init',
    error: undefined,
    stream: undefined,
    previewLocation,
    previewUrl,
    webcontainer: shallowRef(undefined),
  }
})
