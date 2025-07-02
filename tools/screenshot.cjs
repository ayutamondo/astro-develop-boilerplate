const fs = require('fs')
const path = require('path')
const glob = require('glob')
const playwright = require('playwright')

const distDir = './dist'
const outputDir = './screenshots'
const viewports = [
  { width: 375, height: 812, name: 'mobile' },
  { width: 1440, height: 800, name: 'desktop' },
]

async function getHtmlFiles() {
  return new Promise((resolve, reject) => {
    glob(distDir + '/**/*.html', (err, files) => {
      if (err) reject(err)
      else resolve(files)
    })
  })
}

async function run() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const browser = await playwright.chromium.launch({ headless: true })
  const page = await browser.newPage()

  // Astroのdevサーバーのポート番号に合わせてください
  const baseUrl = 'http://localhost:4321/'

  const htmlFiles = await getHtmlFiles()

  for (const file of htmlFiles) {
    for (const vp of viewports) {
      const relativePath = path.relative(distDir, file).replace(/\\/g, '/') // "about/index.html" など
      const fileUrl = baseUrl + relativePath

      // 出力ファイル名を "about-mobile.png" のように作る
      const cleanName =
        relativePath
          .replace(/\/index\.html$/, '') // "/about/index.html" → "/about"
          .replace(/\.html$/, '') // "/privacy.html" → "/privacy"
          .replace(/\//g, '-') || // "/" → "-"
        'home' // トップページだけは 'home' にする

      const outputPath = path.join(outputDir, `${cleanName}-${vp.name}.png`)

      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(fileUrl, { waitUntil: 'load' })
      await page.waitForFunction('document.readyState === "complete"')
      await page.screenshot({ path: outputPath, fullPage: true })

      console.log(`📸 ${outputPath} に保存しました`)
    }
  }

  await browser.close()
}

run().catch((err) => {
  console.error('エラー発生:', err)
  process.exit(1)
})
