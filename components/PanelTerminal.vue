<script setup lang="ts">
const ui = useUiState()
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div
      flex="~ gap-2 items-center"
      border="b base dashed"
      bg-faded
      pl4 py2
    >
      <div i-ph-terminal-window-duotone />
      <span text-sm>Terminal</span>
      <div flex-auto />
      <button
        hover="bg-active"
        rounded p1
        @click="ui.toggleTeminal"
      >
        <div i-ph-x-bold />
      </button>
    </div>
    <PanelTerminalClient />
  </div>
</template>
