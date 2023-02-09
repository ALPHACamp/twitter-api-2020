const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  fileFilter: (req, file, cb) => {
    if (file && !file.mimetype.includes('image')) cb(new Error('Image file only!'))
    cb(null, true)
  }
})
module.exports = upload
