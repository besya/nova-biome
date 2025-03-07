"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
class BiomeLanguageServer {
    constructor(syntaxes = []) {
        this.languageClient = null;
        this.syntaxes = syntaxes;
        nova.config.observe('besya.biome.path', (path) => {
            this.start(path);
        });
    }
    start(path = '/opt/homebrew/bin/biome') {
        if (nova.inDevMode())
            console.log('Activating Biome LSP...');
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
        }
        const serverOptions = {
            path: path,
            args: ['lsp-proxy'],
        };
        const clientOptions = {
            // debug: nova.inDevMode(),
            syntaxes: this.syntaxes,
        };
        const client = new LanguageClient('biome-langserver', 'Biome Language Server', serverOptions, clientOptions);
        try {
            if (nova.inDevMode())
                console.log('Starting Biome Client...');
            client.start();
            nova.subscriptions.add(client);
            this.languageClient = client;
        }
        catch (err) {
            if (nova.inDevMode()) {
                console.error(err);
            }
        }
    }
    downloadPackage() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Download');
        });
    }
    stop() {
        if (nova.inDevMode())
            console.log('Deactivating Biome...');
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
            this.languageClient = null;
        }
    }
    formatDocument(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.languageClient) {
                return;
            }
            const document = editor.document;
            const params = {
                textDocument: {
                    uri: document.uri,
                },
                options: {
                    tabSize: nova.config.get('editor.tabSize', 'number') || 2,
                    insertSpaces: nova.config.get('editor.insertSpaces', 'boolean') !== false,
                },
            };
            try {
                const edits = yield this.languageClient.sendRequest('textDocument/formatting', params);
                if (edits && edits.length > 0) {
                    yield editor.edit((edit) => {
                        for (const textEdit of edits) {
                            const range = (0, helpers_1.lspRangeToRange)(document, textEdit.range);
                            edit.replace(range, textEdit.newText);
                        }
                    });
                }
            }
            catch (error) {
                console.error('Formatting failed:', error);
                nova.workspace.showErrorMessage('Failed to format document with Biome.');
            }
        });
    }
}
exports.default = BiomeLanguageServer;
