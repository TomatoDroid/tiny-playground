import type { VirtualFile } from '~/structures/File'

export type PlaygroundStatus = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'

export interface PlaygroundState {
  files: VirtualFile[]
  status: PlaygroundStatus
  error: { message: string } | undefined
  stream: ReadableStream | undefined
  previewLocation: {
    origin: string
    fullPath: string
  }
  previewUrl: string
}

export const usePlaygroundStore = defineStore<'playground', PlaygroundState>('playground', () => {
  const status = ref<PlaygroundStatus>('init')
  const error = shallowRef<{ message: string }>()
  const stream = ref<ReadableStream | undefined>()

  const previewLocation = ref({
    origin: '',
    fullPath: '',
  })

  const previewUrl = computed(() => previewLocation.value.origin + previewLocation.value.fullPath)

  return reactive({
    files: shallowRef<VirtualFile[]>([]),
    status,
    error,
    stream,
    previewLocation,
    previewUrl,
  })
}) as unknown as () => PlaygroundState
