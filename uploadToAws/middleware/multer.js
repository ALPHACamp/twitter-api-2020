const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('請上傳圖檔！', { statusCode: 400 }))
    }
    return cb(null, true)
  }
})
module.exports = upload
