const multer = require('multer')
const createError = require('http-errors')

const fileSizeLimit = 20 * 1024 * 1024
const upload = multer({
  dest: 'temp/',
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split('/')

    if (!(fileType[0] === 'image' && fileType[1] !== 'svg+xml')) cb(createError(400, '請上傳圖片檔'))
    if (file.size > fileSizeLimit) cb(createError(400, '檔案大小超過限制'))

    return cb(null, true)
  }
})

module.exports = upload
