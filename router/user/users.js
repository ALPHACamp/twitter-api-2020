const router = require('express').Router()
const userController = require('../../controller/user/userController')
const multer = require('multer')
const upload = multer()

// user
router.get('/:id', userController.getUser)
router.put(
  '/:id',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  userController.putUser
)

router.get('/test', userController.userTest)

module.exports = router
