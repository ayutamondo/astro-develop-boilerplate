const fs = require('fs')
const path = require('path')
const glob = require('glob')
const beautify = require('js-beautify').html

const distDir = path.resolve(__dirname, '../dist')

const beautifyOptions = {
  indent_size: 2,
  preserve_newlines: true,
  max_preserve_newlines: 1,
  wrap_line_length: 0,
  end_with_newline: true,
  unformatted: ['code', 'pre'],
  content_unformatted: ['script', 'style'],
}

// 相対パスの基準になる作業ディレクトリ
const cwd = process.cwd()

const files = glob.sync(`${distDir}/**/*.html`)

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8')
  const formatted = beautify(content, beautifyOptions)
  fs.writeFileSync(file, formatted, 'utf8')

  // ✅ 相対パス表示
  const relativePath = path.relative(cwd, file)
  console.log(`✅ Beautified: ${relativePath}`)
})
