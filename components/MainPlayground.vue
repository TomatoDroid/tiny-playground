<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const ui = useUiState()
const play = usePlaygroundStore()

function startDragging() {
  ui.isPanelDragging = true
}

function endDraggingVertical(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelDocs = e[0].size
}

function endDraggingHorizontal(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelEditor = e[0].size
  ui.panelPreview = e[1].size
}

const terminalPanelProps = computed(() => {
  if (ui.showTerminal) {
    return {
      size: 100 - ui.panelEditor - ui.panelPreview,
    }
  }
  else {
    return {
      size: 0,
      maxSize: 0,
    }
  }
})

const isMounted = useMounted()
const panelInitDocs = computed(() => isMounted.value || {
  width: `${ui.panelDocs}%`,
})
const panelInitRight = computed(() => isMounted.value || {
  width: `${100 - ui.panelDocs}%`,
})
const panelInitEditor = computed(() => isMounted.value || {
  height: `${ui.panelEditor}%`,
})
const panelInitPreview = computed(() => isMounted.value || {
  height: `${ui.panelPreview}%`,
})
const panelInitTerminal = computed(() => isMounted.value || {
  height: `${100 - ui.panelEditor - ui.panelPreview}%`,
})
</script>

<template>
  <Splitpanes
    h-full of-hidden
    @resize="startDragging"
    @resized="endDraggingVertical"
  >
    <Pane
      :size="ui.panelDocs" min-size="10"
      :style="panelInitDocs"
    >
      <PanelDocs />
    </Pane>
    <PanelSplitter />
    <Pane
      :size="100 - ui.panelDocs"
      :style="panelInitRight"
    >
      <Splitpanes
        horizontal relative max-h-full w-full of-hidden
        @resize="startDragging"
        @resized="endDraggingHorizontal"
      >
        <Pane
          :size="ui.panelEditor" min-size="10"
          :style="panelInitEditor"
        >
          <PanelEditor :files="play.files" />
        </Pane>
        <PaneSplitter />
        <Pane
          :size="ui.panelPreview" min-size="10"
          :style="panelInitPreview"
        >
          <PanelPreview />
        </Pane>
        <PaneSplitter />
        <Pane
          v-bind="terminalPanelProps"
          :style="panelInitTerminal"
          :class="ui.showTerminal ? '' : 'pane-hidden'"
        >
          <PanelTerminal />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
