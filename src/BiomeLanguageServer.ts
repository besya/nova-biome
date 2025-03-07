import { lspRangeToRange } from './helpers'

class BiomeLanguageServer {
  languageClient: LanguageClient | null = null
  syntaxes: Syntax[]

  constructor(syntaxes: Syntax[] = []) {
    this.syntaxes = syntaxes
    nova.config.observe('besya.biome.path', (path: string) => {
      this.start(path)
    })
  }

  start(path = '/opt/homebrew/bin/biome') {
    if (nova.inDevMode()) console.log('Activating Biome LSP...')

    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
    }

    const serverOptions: ServerOptions = {
      path: path,
      args: ['lsp-proxy'],
    }

    const clientOptions = {
      // debug: nova.inDevMode(),
      syntaxes: this.syntaxes,
    }

    const client = new LanguageClient(
      'biome-langserver',
      'Biome Language Server',
      serverOptions,
      clientOptions,
    )

    try {
      if (nova.inDevMode()) console.log('Starting Biome Client...')
      client.start()
      nova.subscriptions.add(client)
      this.languageClient = client
    } catch (err) {
      if (nova.inDevMode()) {
        console.error(err)
      }
    }
  }

  async downloadPackage() {
    console.log('Download')
  }

  stop() {
    if (nova.inDevMode()) console.log('Deactivating Biome...')

    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
      this.languageClient = null
    }
  }

  async formatDocument(editor: TextEditor) {
    if (!this.languageClient) {
      return
    }
    const document = editor.document
    const params = {
      textDocument: {
        uri: document.uri,
      },
      options: {
        tabSize: nova.config.get('editor.tabSize', 'number') || 2,
        insertSpaces:
          nova.config.get('editor.insertSpaces', 'boolean') !== false,
      },
    }

    try {
      const edits = await this.languageClient.sendRequest(
        'textDocument/formatting',
        params,
      )

      if (edits && edits.length > 0) {
        await editor.edit((edit) => {
          for (const textEdit of edits) {
            const range: Range = lspRangeToRange(document, textEdit.range)
            edit.replace(range, textEdit.newText)
          }
        })
      }
    } catch (error) {
      console.error('Formatting failed:', error)
      nova.workspace.showErrorMessage('Failed to format document with Biome.')
    }
  }
}

export default BiomeLanguageServer
