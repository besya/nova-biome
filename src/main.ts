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
]

export function activate() {
  createOrRestartLSP()

  nova.workspace.onDidAddTextEditor((editor) => {
    editor.onWillSave(async (editor) => {
      if (
        shouldFormatOnSave() &&
        syntaxes.includes(editor.document.syntax ?? '')
      ) {
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
      createOrRestartLSP()
    })
  })
}

export function deactivate() {
  stopLSP()
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
