const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  fileFilter: function (_req, file, cb) {
    // 檢查檔案類型
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('只能上傳圖片'))
    }
    // 如果檔案符合標準，則接受上傳
    cb(null, true)
  }
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])

module.exports = upload
