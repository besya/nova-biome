import BiomeLanguageServer from './BiomeLanguageServer'

let languageServer: BiomeLanguageServer | null = null
const syntaxes = [
  'astro',
  'css',
  'graphql',
  'javascript',
  'javascriptreact',
  'json',
  'jsonc',
  'svelte',
  'typescript',
  'typescript.tsx',
  'typescriptreact',
  'vue',
  { syntax: 'jsx', languageId: 'javascriptreact' } as Syntax,
  { syntax: 'tsx', languageId: 'typescriptreact' } as Syntax,
]

export function activate() {
  nova.commands.register('besya.biome.restart', createOrRestartLSP)
  nova.commands.register('besya.biome.stop', stopLSP)

  stopLSP()
  createOrRestartLSP()

  nova.workspace.onDidAddTextEditor((editor) => {
    editor.onWillSave(async (editor) => {
      if (shouldFormatOnSave() && isSyntaxSupported(editor.document.syntax)) {
        await languageServer?.formatDocument(editor)
      }
    })
  })

  const { path } = nova.workspace
  const watchedFilenames = [
    'biome.json',
    'biome.jsonc',
    '.editorconfig',
    'rome.json',
  ]

  const watchedPaths = watchedFilenames.map((filename) => `${path}/${filename}`)

  nova.workspace.onDidAddTextEditor((editor) => {
    if (!watchedPaths.includes(editor.document.path || '')) {
      return
    }
    editor.onDidSave(async (_editor) => {
      stopLSP()
      createOrRestartLSP()
    })
  })
}

export function deactivate() {
  stopLSP()
}

function isSyntaxSupported(syntax: string | null): boolean {
  return syntaxes.some(
    (supportedSyntax) =>
      supportedSyntax === syntax ||
      (supportedSyntax as DetailedSyntax).syntax === syntax,
  )
}

function createOrRestartLSP() {
  stopLSP()
  languageServer = new BiomeLanguageServer(syntaxes)
}

function stopLSP() {
  if (languageServer) {
    languageServer.stop()
    languageServer = null
  }
}

// Resolve formatOnSave setting (workspace > global)
function shouldFormatOnSave() {
  const configKey = 'besya.biome.formatOnSave'
  // Check workspace config first
  // const workspaceValue = nova.workspace.config.get(configKey, 'boolean')
  // if (workspaceValue !== null && workspaceValue !== undefined) {
  //   return workspaceValue
  // }
  // Fall back to global config
  return nova.config.get(configKey, 'boolean')
}
