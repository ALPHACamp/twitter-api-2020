const router = require('express').Router()
const userController = require('../../controllers/user/userController')
const multer = require('multer')
const upload = multer()
const { authenticated } = require('../../middleware/auth')
// user
router.post('/', userController.signUp)
router.get('/:id', authenticated, userController.getUser)
router.put(
  '/:id',
  authenticated,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  userController.putUser
)

module.exports = router
