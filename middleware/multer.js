const multer = require('multer')
const upload = multer(
  {
    dest: 'temp/',
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error('Please upload an image(.jpg, .jpeg, or .png)'))
      }
      cb(null, true)
    }
  })
module.exports = upload
