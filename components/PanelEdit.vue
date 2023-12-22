<script setup lang="ts">
import type { File } from '~/structures/File'

withDefaults(
  defineProps<{
    files: File[]
  }>(),
  {
    files: () => [],
  },
)

const selectedFile = ref<File>()

const input = ref<string>()

function selectFile(file: File) {
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
    <div flex="~ gap-1 items-center" px4 py2 border="b base dashed" bg-faded>
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
        bg-transparent
        w-full h-full p4 font-mono
        @input="onTextInput"
      />
    </div>
  </div>
</template>
