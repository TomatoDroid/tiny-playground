<script setup lang="ts">
// @ts-expect-error missing type
import { Pane, Splitpanes } from 'splitpanes'

const isDragging = usePanelDragging()
const stream = useTerminalStream()
const panelSizeGuide = usePanelCookie('nuxt-playground-panel-left', 30)
const panelSizeEditor = usePanelCookie('nuxt-playground-panel-edit', 30)
const panelSizeFrame = usePanelCookie('nuxt-playground-panel-frame', 30)

function startDragging() {
  isDragging.value = true
}

function endDraggingVertical(e: { size: number }[]) {
  isDragging.value = false
  panelSizeGuide.value = e[0].size
}

function endDraggingHorizontal(e: { size: number }[]) {
  isDragging.value = false
  panelSizeEditor.value = e[0].size
  panelSizeFrame.value = e[1].size
}
</script>

<template>
  <Splitpanes
    class="h-full of-hidden"
    @resize="startDragging"
    @resized="endDraggingVertical"
  >
    <Pane :size="panelSizeGuide" min-size="10">
      <PanelGuide />
    </Pane>
    <Pane :size="100 - panelSizeGuide">
      <Splitpanes
        class="of-hidden relative"
        horizontal
        @resize="startDragging"
        @resized="endDraggingHorizontal"
      >
        <Pane :size="panelSizeEditor" min-size="10">
          <PanelEdit />
        </Pane>
        <Pane :size="panelSizeFrame" min-size="10">
          <PanelPreview />
        </Pane>
        <Pane :size="100 - panelSizeEditor - panelSizeFrame">
          <PanelTerminal :stream="stream" />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
