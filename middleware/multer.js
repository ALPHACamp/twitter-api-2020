const multer = require('multer')
const createError = require('http-errors')

const upload = multer({
  dest: 'temp/',
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split('/')
    if (!(fileType[0] === 'image' && fileType[1] !== 'svg+xml')) cb(createError(415, '請上傳圖片檔'))

    return cb(null, true)
  }
})

module.exports = upload
