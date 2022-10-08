const router = require('express').Router()
const userController = require('../../controllers/user/userController')
const multer = require('multer')
const upload = multer()
// user
router.get('/:id', userController.getUser)
router.put('/:id',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  userController.putUser
)


module.exports = router