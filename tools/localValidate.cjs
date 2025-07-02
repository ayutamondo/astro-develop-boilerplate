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
    const lines = content.split('\n')
    const foundDivs = []

    lines.forEach((line, index) => {
      const divMatches = line.match(/<div(?![^>]*\s(class|id)=)[^>]*>/g)
      if (divMatches) {
        divMatches.forEach((div) => {
          foundDivs.push({
            line: index + 1,
            content: div,
          })
        })
      }
    })

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
