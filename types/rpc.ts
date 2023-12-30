export interface FrameFunctions {
  onColorModeChange(mode: string): void
}

export interface ParentFunctions {
  onReady(info: ClientInfo): void
  onNagivate(path: string): void
}

export interface ClientInfo {
  versionVue: string
  versionNuxt: string
}
