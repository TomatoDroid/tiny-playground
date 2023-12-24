export const useUiState = defineStore('ui', () => {
  const isPanelDragging = ref(false)

  const presistSize = reactive({
    panelDocs: 30,
    panelEditor: 30,
    panelPreview: 30,
  })

  const stateCookie = useCookie<Partial<typeof presistSize>>(
    'nuxt-playground-ui-state',
    {
      default: () => ({}),
      watch: true,
    },
  )

  Object.assign(presistSize, stateCookie.value)
  watch(presistSize, () => {
    stateCookie.value = { ...presistSize }
  })

  return {
    isPanelDragging,
    ...toRefs(presistSize),
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUiState, import.meta.hot))
