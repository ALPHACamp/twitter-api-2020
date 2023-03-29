const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'DEV'
  }
})

const fileFilter = async (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Please upload a valid image file'))
  }
  cb(undefined, true)
}

const upload = multer({ storage: storage, fileFilter })
module.exports = upload
