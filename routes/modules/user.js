const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const batchUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.put('/users/:id', batchUpload, userController.putUserProfile)
router.put('/users/:id/account', batchUpload, userController.putUserAccount)
router.get('/users/:id', userController.getUser)
router.post('/users', userController.postUser)
router.get('/users', userController.getUsers)

module.exports = router
