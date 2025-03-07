interface Crypto {
  randomUUID(): string
}

interface Environment {
  readonly crypto: Crypto
}

interface Workspace {
  onDidAddTextEditor(
    callback: (editor: TextEditor) => void,
    thisValue?: object,
  ): Disposable
}

interface TextEditor {
  startShadowTyping(ranges: [Range], charset?: Charset): void
  onDidStopChanging(
    callback: (textEditor: TextEditor) => void,
    thisValue?: object,
  ): Disposable
}

interface TextEditorEdit {
  replace(range: Range, text: string, format?: InsertTextFormat)
  onDidStopChanging(
    callback: (editor: TextEditor) => void,
    thisValue?: object,
  ): Disposable
}

interface Configuration {
  onDidChange<T>(
    key: string,
    callback: (newValue: T, oldValue: T) => void,
    thisValue?: object,
  ): Disposable
}

interface LanguageClient extends Disposable {
  sendRequest(
    method: 'textDocument/formatting',
    parameters?: unknown,
  ): Promise<LspTextEdit[]>
}

interface ServerOptions {
  type?: 'stdio' | 'socket' | 'pipe'
  path: string
  args?: string[]
  env?: { [key: string]: string }
}

interface DetailedSyntax {
  syntax: string
  languageId: string
}

type Syntax = string | DetailedSyntax

declare class LanguageClient {
  constructor(
    identifier: string,
    name: string,
    serverOptions: ServerOptions,
    clientOptions: { initializationOptions?: any; syntaxes: Syntax[] },
  )

  readonly identifier: string
  readonly name: string
  readonly running: boolean

  onDidStop<T>(
    callback: (this: T, err?: Error) => void,
    thisValue?: T,
  ): Disposable
  onNotification(method: string, callback: (parameters: any) => void): void
  onRequest(
    method: string,
    callback: (parameters: any) => unknown | Promise<unknown>,
  ): void
  sendRequest(method: string, parameters?: unknown): Promise<unknown>
  sendNotification(method: string, parameters?: unknown): void
  start(): void
  stop(): void
}
