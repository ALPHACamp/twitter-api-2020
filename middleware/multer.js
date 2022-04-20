const multer = require('multer')
const upload = multer({ dest: 'temp/', limit: { fileSize: 10 * 1024 * 1024 } })
module.exports = upload
