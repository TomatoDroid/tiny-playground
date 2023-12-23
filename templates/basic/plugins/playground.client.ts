export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach((to) => {
    window.parent.postMessage({
      type: 'update:path',
      path: to.fullPath,
    }, '*')
  })
})
