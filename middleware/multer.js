const multer = require('multer')
// store the file data in temp directory and store the file info in req.file
const upload = multer({
  dest: 'temp/',
  fileFilter (req, file, cb) {
    // user can only upload image
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      cb(new Error('Please upload an image.'))
    }
    cb(null, true)
  }
})

module.exports = upload
