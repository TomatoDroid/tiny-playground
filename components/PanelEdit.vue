<script setup lang="ts">
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
  input.value = file?.read()!
})

function onTextInput() {
  if (input.value != null)
    selectedFile.value?.write(input.value)
}
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-1 items-center" border="b base dashed" bg-faded px4 py2>
      <div i-ph-text-t-duotone />
      <span text-sm>Editor</span>
    </div>
    <div grid="~ cols-[1fr_2fr]">
      <div flex="~ col" h-full of-auto>
        <PanelEditorFileSystemTree
          v-model="selectedFile"
          :directory="directory"
          :depth="-1"
        />
      </div>
      <PanelEditorClient
        v-if="selectedFile"
        v-model="input"
        :filepath="selectedFile.filePath"
        h-full w-full
        @change="onTextInput"
      />
      <!-- <textarea
        v-model="input"
        border="l base"

        h-full w-full resize-none bg-transparent p4 font-mono
        @input="onTextInput"
      /> -->
    </div>
  </div>
</template>
~/structures/VirtualFile
