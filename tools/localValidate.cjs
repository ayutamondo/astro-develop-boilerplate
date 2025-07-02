const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { exec } = require('child_process')

// 出力先ディレクトリ
const distDir = './dist'

/* ==================================
ローカルで html-validate 実行
================================== */
function htmlValidate() {
  const pattern = `${distDir}/**/*.html`
  const cmd = `npx html-validate "${pattern}"`

  console.log('🔍 html-validate を実行します…')
  exec(cmd, (err, stdout, stderr) => {
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
    if (err) console.error(`❌ エラー: ${err}`)
  })
}

/* ==================================
クラス・IDなし<div>を検出
================================== */
function searchDivs() {
  const htmlFiles = glob.sync(path.join(distDir, '/**/*.html'))

  htmlFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8')
    const foundDivs = []

    // 属性がなくてもマッチさせる
    const regex = /<div(?:\s+([^>]*?))?>/g
    let match

    while ((match = regex.exec(content)) !== null) {
      const attrs = match[1] || ''
      const lineNumber = content.substring(0, match.index).split('\n').length

      // class="" や id="" も除外対象にしない（=警告出す）
      const classMatch = attrs.match(/\bclass\s*=\s*["']([^"']*)["']/)
      const idMatch = attrs.match(/\bid\s*=\s*["']([^"']*)["']/)

      const hasNonEmptyClass = classMatch && classMatch[1].trim() !== ''
      const hasNonEmptyId = idMatch && idMatch[1].trim() !== ''

      if (!hasNonEmptyClass && !hasNonEmptyId) {
        foundDivs.push({
          line: lineNumber,
          content: `<div${attrs ? ' ' + attrs : ''}>`,
        })
      }
    }

    if (foundDivs.length > 0) {
      console.log(`⚠️ クラス・IDなし<div>を検出: ${file}`)
      foundDivs.forEach((d) => {
        console.log(`  Line ${d.line}: ${d.content}`)
      })
    }
  })
}

/* ==================================
実行部分
================================== */
;(async () => {
  console.log('\n🔍 クラス・IDなし<div>をチェック中…')
  searchDivs()

  console.log('\n🧪 html-validate（ローカルチェック）開始...')
  htmlValidate()
})()
