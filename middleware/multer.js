const multer = require('multer')
// 使用者上傳的圖片站存到temp資料夾中
const upload = multer({ dest: 'temp/' })
module.exports = upload
