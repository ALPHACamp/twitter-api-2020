const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  fileFilter: async (req, file, callback) => {
    const err = new Error('Please check file type to be png, jpeg, or jpg.')
    err.status = 400
    switch (file.mimetype) {
      case 'image/png':
        callback(null, true)
        break
      case 'image/jpg':
        callback(null, true)
        break
      case 'image/jpeg':
        callback(null, true)
        break
      default:
        return callback(err, false)
    }
  }
})

module.exports = upload
