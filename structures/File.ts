import type { FileNode, WebContainer } from '@webcontainer/api'

export class File {
  constructor(
    public readonly filePath: string,
    private _content: string,
    public wc?: WebContainer,
  ) {

  }

  toNode(): FileNode {
    // eslint-disable-next-line ts/no-this-alias
    const self = this
    return {
      file: {
        contents: self._content,
      },
    }
  }

  read() {
    return this._content
  }

  async write(content: string) {
    this._content = content
    if (this.wc)
      await this.wc.fs.writeFile(this.filePath, content, 'utf-8')
  }
}
