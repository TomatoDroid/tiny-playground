// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],
  colorMode: {
    classSuffix: '',
  },
  typescript: {
    includeWorkspace: true,
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
        },
      },
    },
  },
  vite: {
    build: {
      minify: 'esbuild',
      cssMinify: 'esbuild',
    },
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
  },
  vue: {
    defineModel: true,
  },
  content: {
    highlight: {
      theme: {
        default: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
    markdown: {
      remarkPlugins: [
        'remark-external-links',
      ],
    },
  },
  app: {
    head: {
      titleTemplate: '%s - Nuxt Playground',
    },
  },
  devtools: {
    enabled: false,
  },
})
