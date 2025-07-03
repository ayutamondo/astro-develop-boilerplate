const path = require('path')
const fs = require('fs')
const sass = require('sass')

// ソーススタイルディレクトリ
const srcDir = path.resolve(__dirname, '../src/styles')
// 出力先ディレクトリ
const distDir = path.resolve(__dirname, '../dist/css/')
// 注入したい @use 順序（順番に注意）
const sharedPartials = ['_variables', '_mixin']

// SCSSファイル一覧（_で始まらない通常ファイルのみ対象）
const scssFiles = fs.readdirSync(srcDir).filter((file) => {
  return file.endsWith('.scss') && !file.startsWith('_')
})

// SCSS変換処理
scssFiles.forEach((fileName) => {
  const inputPath = path.join(srcDir, fileName)
  const outputPath = path.join(distDir, fileName.replace('.scss', '.css'))

  const rawScss = fs.readFileSync(inputPath, 'utf-8')

  // 自動挿入される @use 文（順序を保持）
  const injectUse = sharedPartials.map((partial) => `@use './${partial}' as *;`).join('\n') + '\n\n'

  const compiledScss = injectUse + rawScss

  const result = sass.compileString(compiledScss, {
    loadPaths: [srcDir],
    style: 'expanded',
  })

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, result.css)

  console.log(`✅ Compiled: ${fileName} → ${outputPath}`)
})
