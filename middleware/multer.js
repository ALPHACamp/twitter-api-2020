const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const uploadMultiple = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])
module.exports = { uploadMultiple }
