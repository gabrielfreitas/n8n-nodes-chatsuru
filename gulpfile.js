// gulpfile.js

const { src, dest } = require('gulp');

// Diretórios
const SOURCE_DIR = 'nodes';
const DEST_DIR = 'dist/nodes';

/**
 * Copia todos os ativos (SVG e JSON) de 'nodes/' para 'dist/nodes/'.
 */
function copyAssets() {
    // Esta tarefa copia:
    // 1. O seu ícone chatsuru.svg (e quaisquer outros SVGs em nodes/)
    // 2. Arquivos JSON (descrição do node e credenciais)
    return src([
        `${SOURCE_DIR}/**/*.svg`,
        `${SOURCE_DIR}/**/*.json`,
        `${SOURCE_DIR}/**/*.png`,
    ]).pipe(dest(DEST_DIR));
}

// Exporta a tarefa que será chamada pelo package.json
exports.copyAssets = copyAssets;