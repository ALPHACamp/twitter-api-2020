// 參考multer doc設定
const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // 使用multer上傳的目標資料夾

module.exports = upload
