import { VirtualFile } from '../structures/File'
import { filesToWebContainerFs } from './utils'

import type { TemplateOptions } from './types'

export default function load(options: TemplateOptions = {}) {
  if (import.meta.server)
    throw new Error('This template can only be used on the client')
  
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
      ...(rawFiles['.nuxtrc'] || '').split(/\n/g),
      ...options.nuxtrc,
    ].filter(Boolean).join('\n')
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
