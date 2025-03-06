"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangeToLspRange = rangeToLspRange;
exports.lspRangeToRange = lspRangeToRange;
function rangeToLspRange(document, range) {
    const fullContents = document.getTextInRange(new Range(0, document.length));
    let chars = 0;
    let startLspRange = {};
    const lines = fullContents.split(document.eol);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const lineLength = lines[lineIndex].length + document.eol.length;
        if (!startLspRange && chars + lineLength >= range.start) {
            const character = range.start - chars;
            startLspRange = { line: lineIndex, character };
        }
        if (startLspRange && chars + lineLength >= range.end) {
            const character = range.end - chars;
            return {
                start: startLspRange,
                end: { line: lineIndex, character },
            };
        }
        chars += lineLength;
    }
    return null;
}
function lspRangeToRange(document, lspRange) {
    const fullContents = document.getTextInRange(new Range(0, document.length));
    const eol = document.eol;
    const lines = fullContents.split(eol);
    let rangeStart = 0;
    let rangeEnd = 0;
    let chars = 0;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const lineLength = lines[lineIndex].length + eol.length;
        if (lspRange.start.line === lineIndex) {
            rangeStart =
                chars + Math.min(lspRange.start.character, lines[lineIndex].length);
        }
        if (lspRange.end.line === lineIndex) {
            rangeEnd =
                chars + Math.min(lspRange.end.character, lines[lineIndex].length);
            break;
        }
        chars += lineLength;
    }
    // Clamp end to document length only if strictly beyond last line
    if (lspRange.end.line > lines.length - 1) {
        // console.log(`End line ${lspRange.end.line} exceeds document lines ${lines.length}, setting to document end`);
        rangeEnd = document.length;
    }
    // console.log(`Converted LSP Range ${JSON.stringify(lspRange)} to Nova Range (${rangeStart}, ${rangeEnd})`);
    return new Range(rangeStart, rangeEnd);
}
