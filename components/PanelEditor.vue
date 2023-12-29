<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { isFileIgnored } from '~/composables/files-ignore'
import type { VirtualFile } from '~/structures/VirtualFile'
import { filesToVirtualFsTree } from '~/templates/utils'

const props = withDefaults(
  defineProps<{
    files: VirtualFile[]
  }>(),
  {
    files: () => [],
  },
)

const ui = useUiState()

const files = computed(() => {
  return props.files.filter(file => !isFileIgnored(file.filePath))
})

const directory = computed(() => filesToVirtualFsTree(files.value))

const selectedFile = ref<VirtualFile>()

const input = ref<string>('')

watchEffect(() => {
  if (selectedFile.value == null && files.value.length > 0)
    selectFile(files.value[0])
})

function selectFile(file: VirtualFile) {
  selectedFile.value = file
  // input.value = file.read()
}

watch(selectedFile, (file) => {
  input.value = file?.read() || ''
})

function onTextInput() {
  if (input.value != null)
    selectedFile.value?.write(input.value)
}

function startDragging() {
  ui.isPanelDragging = true
}
function endDragging(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelFileTree = e[0].size
}
// For panes size initialization on SSR
const isMounted = useMounted()
const panelInitFileTree = computed(() => isMounted.value || {
  width: `${ui.panelFileTree}%`,
})
const panelInitEditor = computed(() => isMounted.value || {
  width: `${100 - ui.panelFileTree}%`,
})
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-1 items-center" border="b base dashed" bg-faded px4 py2>
      <div i-ph-text-t-duotone />
      <span text-sm>Editor</span>
    </div>
    <Splitpanes
      @resize="startDragging"
      @resized="endDragging"
    >
      <Pane
        flex="~ col" h-full of-auto py1
        :size="ui.panelFileTree"
        :style="panelInitFileTree"
      >
        <PanelEditorFileSystemTree v-model="selectedFile" :directory="directory" :depth="-1" />
      </Pane>
      <PanelSplitter />
      <Pane
        :size="100 - ui.panelFileTree"
        :style="panelInitEditor"
      >
        <LazyPanelEditorMonaco
          v-if="selectedFile" v-model="input" :filepath="selectedFile.filePath" h-full w-full
          @change="onTextInput"
        />
      </Pane>
    </Splitpanes>
  </div>
</template>
