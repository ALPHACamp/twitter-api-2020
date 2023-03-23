const multer = require('multer')
// - 將上傳的圖片暫存到 temp 資料夾
const upload = multer({ dest: 'temp/' })
module.exports = upload