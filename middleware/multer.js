// 引入multer
const multer = require('multer')
// 呼吸multer方法，用者上傳的圖片會暫存到 temp 資料夾
const upload = multer({ dest: 'temp/' })

// 匯出模組
module.exports = upload