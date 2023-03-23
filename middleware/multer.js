const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // temp 資料夾負責接收、處理傳來的封包

module.exports = upload
