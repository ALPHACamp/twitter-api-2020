const router = require('express').Router()
const followShipsController = require('../../controllers/user/followShipsController')

router.post('/' , followShipsController.addFollow )
router.delete('/:followingId' , followShipsController.removeFollow)
module.exports = router
