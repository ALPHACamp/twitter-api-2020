const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  fileFilter (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') return cb(null, true)

    const err = new Error('Please upload image file format.')
    err.status = 400
    return cb(err, false)
  }
})

module.exports = upload
