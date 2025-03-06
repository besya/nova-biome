# Biome

**Biome** extension provides support for the [Biome](https://biomejs.dev) in Nova.
It uses `biome lsp-proxy` as LSP server

Format code like Prettier, save time
 - Biome is a fast formatter for JavaScript, TypeScript, JSX, TSX, JSON, CSS and GraphQL that scores 97% compatibility with Prettier, saving CI and developer time.

Fix problems, learn best practice
 - Biome is a performant linter for JavaScript, TypeScript, JSX, CSS and GraphQL that features 315 rules from ESLint, TypeScript ESLint, and other sources.

![Example](https://raw.githubusercontent.com/besya/nova-biome/refs/heads/main/examples/example.gif)

## Prequesites

### Install Biome

```
brew install biome
```

## Supports

- Diagnostics
- Code Actions
- Format on Save (disabled by default)

## Settings
Go to Extensions -> Extension Library... -> Biome -> Settings

### Biome path
Default value: `/opt/homebrew/bin/biome`
Change it if you installed `biome` without `brew`

### Format on Save
Enables/Disables autoformat on save using biome

## Syntaxes
Currently included syntaxes: astro, css, graphql, javascript, javascriptreact, json, jsonc, svelte, typescript, typescript.tsx, typescriptreact, vue

## Configuration files
The **Biome** extension watches changes in `biome.json`, `biome.jsonc`, `.editorconfig` and `rome.json` and restarts the LSP server to immediately reflect changes on diagnostics/formatting behavior

### Example config
biome.json
```json
{
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 80,
    "attributePosition": "auto"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "all",
      "semicolons": "asNeeded",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "quoteStyle": "single",
      "attributePosition": "auto"
    }
  },
  "overrides": [
    {
      "include": ["*.json"],
      "formatter": {
        "indentWidth": 2
      }
    }
  ]
}
```

## Development

1. Clone repo

    `git clone https://github.com/besya/nova-biome.git`

2. Navigate to project folder

    `cd nova-biome`

3. Install dependencies

    `npm install`

4. Run watch

    `npm run watch`

5. Enable extension

    **Extensions > Activate Project as Extension**

### NPM commands

Clean (cleans `biome.novaextension/Scripts` directory)

`npm run clean`

Build (builds `src` to `biome.novaextension/Scripts`)

`npm run build`

Watch (rebuilds `src` to `biome.novaextension/Scripts` on `src` change)

`npm run watch`
