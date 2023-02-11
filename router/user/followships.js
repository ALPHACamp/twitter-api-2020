const router = require('express').Router()
const followShipsController = require('../../controllers/user/followShipsController')

router.post('/', followShipsController.addFollow)
router.delete('/:followingId', followShipsController.removeFollow)
router.get('/followers/top10', followShipsController.getTop10FollowerUser)
module.exports = router
