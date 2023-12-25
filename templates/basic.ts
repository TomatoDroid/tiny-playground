import { VirtualFile } from '../structures/File'
import { filesToWebContainerFs } from './utils'

import type { TemplateOptions } from './types'

export default function load(options: TemplateOptions = {}) {
  const rawInput = import.meta.glob([
    './basic/**/*.*',
    './basic/**/.npmrc',
    './basic/**/.layer-playground/**/*.*',
    './basic/**/.nuxtrc',
  ], {
    as: 'raw',
    eager: true,
  })

  const rawFiles = {
    ...Object.fromEntries(
      Object.entries(rawInput)
        .map(([key, value]) => {
          return [key.replace('./basic/', ''), value]
        }),
    ),
    ...options.files,
  }

  if (options.nuxtrc) {
    rawFiles['.nuxtrc'] = [
      rawFiles['.nuxtrc'] || '',
      ...options.nuxtrc,
    ].join('\n')
  }

  const files = Object.entries(rawFiles)
    .map(([path, content]) => {
      return new VirtualFile(path, content)
    })

  const tree = filesToWebContainerFs(
    files,
  )

  return {
    files,
    tree,
  }
}
