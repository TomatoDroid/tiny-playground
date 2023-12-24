export const useUiState = defineStore('ui', () => {
  const isPanelDragging = ref(false)

  const presistSize = reactive({
    panelDocs: 30,
    panelEditor: 30,
    panelPreview: 40,
    showTerminal: false,
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

  function toggleTeminal() {
    const TERMINAL_HEIGHT = 30
    presistSize.showTerminal = !presistSize.showTerminal
    if (presistSize.showTerminal) {
      presistSize.panelEditor = presistSize.panelEditor / 100 * (100 - TERMINAL_HEIGHT)
      presistSize.panelPreview = presistSize.panelPreview / 100 * (100 - TERMINAL_HEIGHT)
    }
    else {
      const remaining = presistSize.panelEditor + presistSize.panelPreview
      presistSize.panelEditor = presistSize.panelEditor / remaining * 100
      presistSize.panelPreview = presistSize.panelPreview / remaining * 100
    }
  }

  return {
    isPanelDragging,
    toggleTeminal,
    ...toRefs(presistSize),
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUiState, import.meta.hot))
