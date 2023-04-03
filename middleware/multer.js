// const path = require('path')
const multer = require('multer')
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '..', 'temp'))
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
//   }
// })

// // Init upload
// const upload = multer({ storage })
const upload = multer({ dest: 'temp/' })
module.exports = upload
