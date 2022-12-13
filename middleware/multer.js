const multer = require('multer')
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file && file.mimetype !== 'image/png') cb(new Error('Image file only!'))
    cb(null, true)
  }
})

module.exports = upload
