<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import '../monaco/worker'

const props = defineProps<{
  modelValue: string
  filepath: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const theme = useColorMode()

const el = ref<HTMLDivElement>()

const models = new Map<string, monaco.editor.ITextModel>()

const language = computed(() => {
  const ext = props.filepath.split('.').pop()
  switch (ext) {
    case 'js':
      return 'javascript'
    case 'ts':
      return 'typescript'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    case 'vue':
    case 'html':
      return 'html'
    default:
      return 'plaintext'
  }
})

function getModal(filepath: string) {
  let model: monaco.editor.ITextModel
  if (!models.has(filepath)) {
    model = monaco.editor.createModel(
      props.modelValue,
      language.value,
      monaco.Uri.file(props.filepath),
    )
    models.set(filepath, model)
  }
  else {
    model = models.get(filepath)!
  }
  model.setValue(props.modelValue)
  return model
}

watch(
  () => el.value,
  (value) => {
    if (!value)
      return

    const editor = monaco.editor.create(
      value,
      {
        model: getModal(props.filepath),
        theme: theme.value,
        fontSize: 14,
        bracketPairColorization: {
          enabled: false,
        },
        glyphMargin: false,
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
      },
    )

    editor.onDidChangeModelContent(() => {
      emit('update:modelValue', editor.getValue())
    })

    watch(
      () => props.filepath,
      () => {
        editor.setModel(getModal(props.filepath))
      },
    )

    watch(theme, () => monaco.editor.setTheme(theme.value))
  },
)
</script>

<template>
  <div ref="el" />
</template>
