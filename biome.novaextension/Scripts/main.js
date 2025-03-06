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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const BiomeLanguageServer_1 = __importDefault(require("./BiomeLanguageServer"));
let languageServer = null;
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
];
function activate() {
    createOrRestartLSP();
    nova.workspace.onDidAddTextEditor((editor) => {
        editor.onWillSave((editor) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (shouldFormatOnSave() &&
                syntaxes.includes((_a = editor.document.syntax) !== null && _a !== void 0 ? _a : '')) {
                yield (languageServer === null || languageServer === void 0 ? void 0 : languageServer.formatDocument(editor));
            }
        }));
    });
    const { path } = nova.workspace;
    const watchedFilenames = [
        'biome.json',
        'biome.jsonc',
        '.editorconfig',
        'rome.json',
    ];
    const watchedPaths = watchedFilenames.map((filename) => `${path}/${filename}`);
    nova.workspace.onDidAddTextEditor((editor) => {
        if (!watchedPaths.includes(editor.document.path || '')) {
            return;
        }
        editor.onDidSave((_editor) => __awaiter(this, void 0, void 0, function* () {
            createOrRestartLSP();
        }));
    });
}
function deactivate() {
    stopLSP();
}
function createOrRestartLSP() {
    stopLSP();
    languageServer = new BiomeLanguageServer_1.default(syntaxes);
}
function stopLSP() {
    if (languageServer) {
        languageServer.stop();
        languageServer = null;
    }
}
// Resolve formatOnSave setting (workspace > global)
function shouldFormatOnSave() {
    const configKey = 'besya.biome.formatOnSave';
    // Check workspace config first
    // const workspaceValue = nova.workspace.config.get(configKey, 'boolean')
    // if (workspaceValue !== null && workspaceValue !== undefined) {
    //   return workspaceValue
    // }
    // Fall back to global config
    return nova.config.get(configKey, 'boolean');
}
