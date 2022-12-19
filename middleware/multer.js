const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  fileFilter (req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      cb(new Error('Please upload an image'))
    }
    cb(null, true)
  }
})

module.exports = upload
