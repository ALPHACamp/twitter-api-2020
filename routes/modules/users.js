const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')


router.get('/:id', userController.getUser)
router.put('/:id', upload.fields([{ name: 'cover' }, { name: 'avatar' }]), userController.editUser)


module.exports = router