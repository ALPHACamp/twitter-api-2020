const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype !== 'image/png' ||
      file.mimetype !== 'image/jpg' ||
      file.mimetype !== 'image/jpeg'
    ) {
      const err = new Error('Please check file type to be png, jpeg, or jpg.')
      err.status = 400
      return callback(err, false)
    }
    callback(null, true)
  }
})

module.exports = upload
