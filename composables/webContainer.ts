import { WebContainer } from '@webcontainer/api'

let _webContainerInstance: WebContainer

export async function useWebContainer() {
  if (!_webContainerInstance)
    _webContainerInstance = await WebContainer.boot()

  return _webContainerInstance
}
