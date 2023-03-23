const multer = require('multer')
const upload = multer({ dest: 'temp/' })
module.exports = upload
