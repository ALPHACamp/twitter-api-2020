const multer = require('multer')
// const upload = multer({ dest: 'temp/' })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

module.exports = upload
