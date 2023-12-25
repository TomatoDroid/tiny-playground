const IGNORE_FILES: (string | RegExp)[] = [
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  /tsconfig\.json$/,
  /^\./,
]
export function isFileIgnored(filePath: string) {
  return IGNORE_FILES.some(pattern => typeof pattern === 'string'
    ? pattern === filePath
    : pattern.test(filePath))
}
