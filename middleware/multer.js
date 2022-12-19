// 參考multer doc設定
const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // 使用multer上傳至本地目標資料夾temp

module.exports = upload
