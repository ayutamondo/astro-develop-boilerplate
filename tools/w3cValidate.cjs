const fs = require('fs')
const path = require('path')
const glob = require('glob')
const htmlValidator = require('html-validator')

// 出力先ディレクトリ
const distDir = './dist'

/* ==================================
W3C HTMLバリデーション（API使用）
================================== */
async function w3cValidate() {
  const files = glob.sync(path.join(distDir, '/**/*.html'))

  if (files.length === 0) {
    console.log('⚠️ HTMLファイルが見つかりませんでした')
    return
  }

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8')
    const options = {
      data: html,
      format: 'json',
    }

    try {
      const result = await htmlValidator(options)
      const messages = result.messages || []
      const errors = messages.filter((msg) => msg.type === 'error')
      const warnings = messages.filter((msg) => msg.type === 'warning' || msg.type === 'info')
      const lines = html.split('\n')

      if (errors.length === 0 && warnings.length === 0) {
        console.log(`✅ ${file}：エラー・警告なし`)
      } else {
        const icon = errors.length > 0 ? '❌' : '⚠️'
        console.log(`${icon} ${file}：${errors.length}件のエラー、${warnings.length}件の警告`)

        messages.forEach((msg) => {
          if (msg.type !== 'error') return

          const mark = '❌'
          const lineNum = msg.lastLine
          const location = lineNum ? `（${lineNum}行目）` : ''
          const snippet = lineNum ? getContext(lines, lineNum, 1) : '(該当行なし)'

          console.log(`  ${mark} ${msg.message} ${location}`)
          console.log(`    ➤ 該当HTML: ${snippet}`)
        })
      }

      // API制限回避のため少し待つ
      await sleep(1000)
    } catch (err) {
      console.error(`❌ ${file}：検証中にエラーが発生しました\n${err}`)
    }
  }
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
ユーティリティ
================================== */
function getContext(lines, lineNum, context = 1) {
  const start = Math.max(lineNum - 1 - context, 0)
  const end = Math.min(lineNum + context, lines.length)
  return lines
    .slice(start, end)
    .map((line, i) => {
      const actualLine = start + i + 1
      const prefix = actualLine === lineNum ? '>> ' : '   '
      return `${prefix}${actualLine}: ${line.trim()}`
    })
    .join('\n          ')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ==================================
実行部分
================================== */
;(async () => {
  console.log('\n🔍 クラス・IDなし<div>をチェック中…')
  searchDivs()

  console.log('\n🧪 HTMLバリデーション開始...')
  await w3cValidate()
})()
