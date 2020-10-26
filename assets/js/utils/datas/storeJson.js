const path = require('path')
const fs = require('fs')
const storeJson = async (name, datas) => {
  return new Promise((resolve) => {
    const generate = require('~/nuxt.config.js').default.generate
    const filePath = process.env.isGenerating ? 'static/api/' : 'dist/api/'
    const file = path.join(filePath + name, 'index.json')
    return fs.promises
      .mkdir(path.dirname(file), { recursive: true })
      .then((x) => {
        fs.promises
          .writeFile(file, JSON.stringify(datas))
          .then((x) => resolve())
      })
  })
}
export default storeJson
