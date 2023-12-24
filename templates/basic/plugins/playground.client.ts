export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach((to) => {
    window.parent.postMessage({
      type: 'update:path',
      path: to.fullPath,
    }, '*')
  })

  window.addEventListener('message', (event) => {
    switch (event.data.type) {
      case 'color-mode':
        document.documentElement.classList.toggle(
          'dark',
          event.data.mode === 'dark',
        )
        break
      default:
        break
    }
  })
})
