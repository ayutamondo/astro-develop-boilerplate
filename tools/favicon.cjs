const fs = require('fs')
const pngToIco = require('png-to-ico')

pngToIco(['src/favicon/favicon.png'])
  .then((buffer) => {
    fs.writeFileSync('public/favicon.ico', buffer)
    console.log('✅ favicon.ico 生成')
  })
  .catch(console.error)
