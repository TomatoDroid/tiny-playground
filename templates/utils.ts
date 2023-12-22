import type { FileSystemTree } from '@webcontainer/api'
import type { File } from '~/structures/File'

export function filesToWebContainerFs(
  files: File[],
) {
  const tree: FileSystemTree = {}

  for (const file of files) {
    if (!file.filePath.includes('/')) {
      tree[file.filePath] = file.toNode()
    }
    else {
      const parts = file.filePath.split('/')
      const filename = parts.pop()!
      let current = tree
      for (const dir of parts) {
        if (!current[dir]) {
          current[dir] = {
            directory: {},
          }
        }
        const node = current[dir]
        if (!('directory' in node))
          throw new Error('Unexpected directory but found file')
        current = node.directory
      }
      current[filename] = file.toNode()
    }
  }
  return tree
}