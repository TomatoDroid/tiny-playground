<script setup lang="ts">
import { isFileIgnored } from '~/composables/files-ignore'
import type { VirtualFile } from '~/structures/File'

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

const selectedFile = ref<VirtualFile>()

const input = ref<string>()

watchEffect(() => {
  if (selectedFile.value == null && files.value.length > 0)
    selectFile(files.value[0])
})

function selectFile(file: VirtualFile) {
  selectedFile.value = file
  input.value = file.read()
}

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
        <button
          v-for="file in files"
          :key="file.filePath"
          px2 py1 hover="bg-active" text-left
          :class="{
            'text-primary': file.filePath === selectedFile?.filePath,
          }"
          @click="selectFile(file)"
        >
          {{ file.filePath }}
        </button>
      </div>
      <textarea
        v-model="input"
        border="l base"

        h-full w-full resize-none bg-transparent p4 font-mono
        @input="onTextInput"
      />
    </div>
  </div>
</template>
