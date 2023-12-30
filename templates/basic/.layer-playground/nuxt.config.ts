import { defineNuxtConfig } from 'nuxt/config'
import { version as versionVue } from 'vue'
import { version as versionNuxt } from 'nuxt/package.json'

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  runtimeConfig: {
    public: {
      clientInfo: {
        versionNuxt,
        versionVue,
      },
    },
  },
  vite: {
    warmupEntry: false,
    optimizeDeps: {
      include: [
        'birpc',
        'ufo',
        'ofetch',
        'defu',
      ],
    },
  },
  typescript: {
    includeWorkspace: true,
    tsConfig: {
      include: [
        '../.layer-playground/**/*',
      ],
    },
  },
  css: [
    '~/.layer-playground/styles/base.css',
  ],
})
