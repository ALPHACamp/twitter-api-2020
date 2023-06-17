const multer = require('multer')
const upload = multer({ dest: 'upload/' })
const multiUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
])
module.exports = {
  upload,
  multiUpload,
}
