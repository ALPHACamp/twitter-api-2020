const multer = require('multer')
const upload = multer({ 
  dest: 'temp/',
  fileFilter
})

module.exports = upload