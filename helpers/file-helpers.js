const fs = require('fs') // 引入 fs 模組

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile((fileName, data)))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const localFilesHandler = async files => {
  if (!files) return
  const filePromises = files.map(async file => {
    const fileName = `upload/${file.originalname}`
    const data = await fs.promises.readFile(file.path)
    await fs.promises.writeFile(fileName, data)

    return `/${fileName}`
  })

  const fileUrls = await Promise.all(filePromises)
  return fileUrls
}
module.exports = {
  localFileHandler,
  localFilesHandler // 處理多個檔案
}
