export interface FrameFunctions {
  onColorModeChange(mode: string): void
}

export interface ParentFunctions {
  onReady(): void
  onNagivate(path: string): void
}
