const multer = require('multer')

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('只接受 jpg、jpeg、png 檔案'))
    }
    cb(null, true)
  },
  dest: 'temp/'
})
const cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])

module.exports = {
  cpUpload
}
