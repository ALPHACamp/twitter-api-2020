const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.post('/:tweet_id/replies',)
router.get('/:tweet_id/replies',)


router.post('/:id/unlike', userController.removeLike)
router.post('/:id/like', userController.addLike)


router.post('/',)
router.get('/',)

module.exports = router
