<script setup lang="ts">
const ui = useUiState()
const play = usePlaygroundStore()

const repo = 'https://github.com/nuxt/learn.nuxt.com'
const runtime = useRuntimeConfig()
const buildTime = new Date(runtime.public.buildTime)
const timeAgo = useTimeAgo(buildTime)
</script>

<template>
  <nav px4 py3 text-lg border="b base" flex="~ gap-1 items-center">
    <NuxtLink to="/" title="Nuxt Playground">
      <NuxtLogo class="h-2em" />
    </NuxtLink>
    <div flex-auto />
    <button
      v-if="play.status === 'ready'"
      rounded p2
      title="download as Zip"
      hover="bg-active"
      @click="play.downloadZip()"
    >
      <div i-ph-download-duotone text-2xl />
    </button>
    <button
      rounded p2
      hover="bg-active"
      title="toggle terminal"
      :class="ui.showTerminal ? '' : 'op50'"
      @click="ui.toggleTeminal()"
    >
      <div i-ph-terminal-window-duotone text-2xl />
    </button>
    <VDropdown :distance="6">
      <button
        rounded p2
        hover="bg-active"
        title="Playground Information"
      >
        <div i-ph-info-duotone text-2xl />
      </button>
      <template #popper>
        <div px5 py4 grid="~ gap-y-3 gap-x-2 cols-[max-content_1fr] items-center">
          <div i-ph-package-duotone text-xl />
          <NuxtLink :to="`${repo}/commit/${runtime.public.gitSha}`" target="_blank" title="View on GitHub">
            <time :datetime="buildTime.toISOString()" :title="buildTime.toLocaleString()">
              Built {{ timeAgo }} (<code>{{ runtime.public.gitSha.slice(0, 5) }}</code>)
            </time>
          </NuxtLink>
        </div>
      </template>
    </VDropdown>
    <ColorSchemeToggle />
    <NuxtLink

      rounded p2
      hover="bg-active"
      title="github"
      href="https://github.com/TomatoDroid/tiny-playground"
      target="_blank"
    >
      <div i-carbon-logo-github text-2xl />
    </NuxtLink>
  </nav>
</template>
